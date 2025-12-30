import React, { useState, useEffect } from 'react';
import './TasksPage.styles.scss';
import {
  FaPlus, FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp,
  FaEdit, FaUserFriends, FaTrash, FaTimes
} from 'react-icons/fa';
import { SlCalender, SlMagnifier, SlShare } from 'react-icons/sl';
import PersianDate from 'persian-date';
import { tokenStorage } from "../../api/axios.js";
import { authFetch } from '../../api/authFetch';

// Handles { message, task: { ... } } or direct task
const normalizeTask = (task) => {
  const actualTask = task.task || task;
  let timeStr = '00:00';
  if (actualTask.time && typeof actualTask.time === 'string') {
    if (actualTask.time.includes('T')) {
      const timePart = actualTask.time.split('T')[1];
      const match = timePart.match(/^(\d{2}):(\d{2})/);
      if (match) {
        timeStr = `${match[1]}:${match[2]}`;
      }
    }
  }

  return {
    id: actualTask.id || Date.now(),
    title: actualTask.title || 'بدون عنوان',
    description: actualTask.description || '',
    time: timeStr,
    category: actualTask.category != null ? parseInt(actualTask.category) : 1,
  };
};

const TasksPage = () => {
  const toPersianNumber = (num) => {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    time: '',
    category: '1',
  });

  const [openSections, setOpenSections] = useState({
    myCalendars: true,
    myActivities: true,
  });

  const [selectedDate, setSelectedDate] = useState({
    year: null,
    month: null,
    day: null,
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new PersianDate();
    setSelectedDate({
      year: today.year(),
      month: today.month(),
      day: today.date(),
    });
  }, []);

  // Fetch tasks when selected date changes
  useEffect(() => {
    if (!selectedDate.year) return;
    fetchTasksForDate(selectedDate);
  }, [selectedDate]);

  const fetchTasksForDate = async (dateObj) => {
    setLoading(true);
    try {
      const pDate = new PersianDate([dateObj.year, dateObj.month, dateObj.day]);
      const gDate = pDate.toDate();
      const pad = (num) => String(num).padStart(2, '0');
      const gDateString = `${gDate.getFullYear()}-${pad(gDate.getMonth() + 1)}-${pad(gDate.getDate())}`;
      const nextDay = new Date(gDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = `${nextDay.getFullYear()}-${pad(nextDay.getMonth() + 1)}-${pad(nextDay.getDate())}`;
      const url = `https://hexacore-iust-backend.liara.run/api/tasks/?time_after=${gDateString}&time_before=${nextDayString}`;

      const token = tokenStorage.getAccess();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await authFetch(url);
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const err = await response.json();
          if (err.detail?.includes('token_not_valid')) {
            tokenStorage.clear();
            alert('نشست منقضی شده. لطفاً دوباره وارد شوید.');
            return;
          }
          throw new Error(err.detail || 'دریافت تسک‌ها با خطا مواجه شد.');
        }

        const text = await response.text();
        console.error('NON-JSON ERROR RESPONSE:', text);

        throw new Error('پاسخ غیرمنتظره از سرور (احتمالاً خطای احراز هویت یا تنظیمات سرور)');
      }


      const rawData = await response.json();
      const tasksArray = rawData.tasks || rawData;
      const taskList = Array.isArray(tasksArray) ? tasksArray : [tasksArray];
      const normalizedTasks = taskList.map(normalizeTask);
      setTasks(normalizedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      alert(`خطا: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editTask) {
      setEditTask({ ...editTask, [name]: value });
    } else {
      setNewTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOrUpdateTask = async (e) => {
    e.preventDefault();

    const taskData = editTask || newTask;
    if (!taskData.time) {
      alert('لطفاً زمان را وارد کنید.');
      return;
    }

    const pad = (n) => String(n).padStart(2, '0');

    try {
      const pDate = new PersianDate([
        selectedDate.year,
        selectedDate.month,
        selectedDate.day,
      ]);
      const gDate = pDate.toDate();

      const [hours, minutes] = taskData.time.split(':').map(Number);

      const fullDatetime =
        `${gDate.getFullYear()}-${pad(gDate.getMonth() + 1)}-${pad(gDate.getDate())}` +
        `T${pad(hours)}:${pad(minutes)}:00`;

      const payload = {
        title: taskData.title,
        description: taskData.description,
        time: fullDatetime, // ✅ بدون toISOString
        category: parseInt(taskData.category),
      };

      const token = tokenStorage.getAccess();
      if (!token) {
        tokenStorage.clear();
        alert('لطفاً مجدداً وارد شوید.');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      let response;
      if (editTask) {
        // Update
        response = await authFetch(`https://hexacore-iust-backend.liara.run/api/tasks/${editTask.id}/update/`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        response = await authFetch('https://hexacore-iust-backend.liara.run/api/tasks/create/', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'خطا در پردازش درخواست';
        if (typeof errorData === 'object') {
          errorMessage = Object.entries(errorData)
            .map(([field, messages]) => {
              const msg = Array.isArray(messages) ? messages.join(', ') : String(messages);
              const labelMap = { title: 'عنوان', description: 'توضیحات', time: 'زمان', category: 'دسته' };
              const label = labelMap[field] || field;
              return `${label}: ${msg}`;
            })
            .join('; ');
        }
        if (errorMessage.includes('token_not_valid')) {
          tokenStorage.clear();
          alert('نشست منقضی شده.');
          return;
        }
        throw new Error(errorMessage);
      }

      const savedTask = await response.json();
      const normalized = normalizeTask(savedTask);

      if (editTask) {
        setTasks(prev => prev.map(t => t.id === normalized.id ? normalized : t));
        setEditTask(null);
      } else {
        setTasks(prev => [...prev, normalized]);
        setNewTask({ title: '', description: '', time: '', category: '1' });
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('API Error:', error);
      alert(`خطا:\n${error.message}`);
    }
  };

  // ✅ Open delete modal
  const handleDeleteTask = (task) => {
    setDeleteTask(task);
  };

  // ✅ Actually delete the task
  const confirmDelete = async () => {
    if (!deleteTask) return;

    try {
      const token = tokenStorage.getAccess();
      if (!token) {
        tokenStorage.clear();
        alert('لطفاً دوباره وارد شوید.');
        setDeleteTask(null);
        return;
      }

      const response = await authFetch(`https://hexacore-iust-backend.liara.run/api/tasks/${deleteTask.id}/delete`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenStorage.clear();
          alert('نشست منقضی شده.');
        } else {
          throw new Error('حذف تسک با خطا مواجه شد.');
        }
        return;
      }

      setTasks(prev => prev.filter(t => t.id !== deleteTask.id));
      setDeleteTask(null);
    } catch (error) {
      console.error('Delete error:', error);
      alert(`خطا در حذف تسک: ${error.message}`);
      setDeleteTask(null);
    }
  };

  const startEdit = (task) => {
    setEditTask({ ...task });
    setIsModalOpen(true);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getDaysInMonth = (year, month) => {
    return new PersianDate([year, month, 1]).daysInMonth();
  };

  const changeMonth = (direction) => {
    setSelectedDate((prev) => {
      let newYear = prev.year;
      let newMonth = prev.month + direction;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
      const maxDay = getDaysInMonth(newYear, newMonth);
      const newDay = prev.day <= maxDay ? prev.day : 1;
      return { year: newYear, month: newMonth, day: newDay };
    });
  };

  const persianMonths = [
    '', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
    'مرداد', 'شهریور', 'مهر', 'آبان',
    'آذر', 'دی', 'بهمن', 'اسفند',
  ];

  const getWeekdayName = (year, month, day) => {
    return new PersianDate([year, month, day]).format('dddd');
  };

  const getGregorianDate = (year, month, day) => {
    return new PersianDate([year, month, day])
      .toDate()
      .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getTaskIcon = (category) => {
    if (category === 1) return <FaEdit />;
    if (category === 2) return <FaUserFriends />;
    return <FaEdit />;
  };

  if (!selectedDate.year) return null;

  const currentMonthName = persianMonths[selectedDate.month];
  const daysInMonth = getDaysInMonth(selectedDate.year, selectedDate.month);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const gregorianDate = getGregorianDate(selectedDate.year, selectedDate.month, selectedDate.day);
  const weekdayName = getWeekdayName(selectedDate.year, selectedDate.month, selectedDate.day);

  return (
    <div
      style={{
        backgroundColor: '#ffffffff',
        width: '100%',
        padding: '20px',
        direction: 'rtl',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      }}
    >
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="task-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>{editTask ? 'ویرایش تسک' : 'ایجاد تسک جدید'}</h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditTask(null);
                  setNewTask({ title: '', description: '', time: '', category: '1' });
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddOrUpdateTask}>
              <div style={{ marginBottom: '12px' }}>
                <label>عنوان تسک:</label>
                <input
                  type="text"
                  name="title"
                  value={editTask ? editTask.title : newTask.title}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>توضیحات:</label>
                <textarea
                  name="description"
                  value={editTask ? editTask.description : newTask.description}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>زمان (HH:MM):</label>
                <input
                  type="time"
                  name="time"
                  value={editTask ? editTask.time : newTask.time}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>دسته‌بندی:</label>
                <select
                  name="category"
                  value={editTask ? String(editTask.category) : newTask.category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                >
                  <option value="1">جلسه / بازگذاری</option>
                  <option value="2">تیمی / همکاری</option>
                  <option value="3">سایر</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditTask(null);
                  }}
                  style={{
                    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                    padding: '8px 16px',
                    background: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  style={{
                    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                    padding: '8px 16px',
                    background: editTask ? '#ffc107' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {editTask ? 'به‌روزرسانی' : 'ایجاد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ DELETE CONFIRMATION MODAL */}
      {deleteTask && (
        <div className="task-modal-overlay" onClick={() => setDeleteTask(null)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>تأیید حذف تسک</h3>
              <button
                type="button"
                onClick={() => setDeleteTask(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <FaTimes />
              </button>
            </div>
            <p style={{ marginBottom: '20px', textAlign: 'center' }}>
              آیا از حذف تسک «<strong>{deleteTask.title}</strong>» در ساعت {toPersianNumber(deleteTask.time)} اطمینان دارید؟
              <br />
              <span style={{ color: '#f44336', fontSize: '0.9em' }}>این عمل قابل بازگشت نیست.</span>
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeleteTask(null)}
                style={{
                  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                  padding: '8px 16px',
                  background: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={{
                  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                  padding: '8px 16px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="tm-container">
        <div className="tm-main-content">
          <div className="tm-sidebar" style={{ order: 2 }}>
            <button
              className="add-button"
              onClick={() => {
                setEditTask(null);
                setNewTask({
                  title: '',
                  description: '',
                  time: '',
                  category: '1',
                });
                setIsModalOpen(true);
              }}
            >
              <FaPlus style={{ marginLeft: '5px' }} />
              <span>اضافه کردن</span>
            </button>

            <div className="calendar-section">
              <div className="calendar-header">
                <div className="calendar-nav">
                  <div className="calendar-nav-btn" onClick={() => changeMonth(1)}>
                    <FaChevronRight className="icon" />
                  </div>
                  <div className="calendar-nav-btn" onClick={() => changeMonth(-1)}>
                    <FaChevronLeft className="icon" />
                  </div>
                </div>
                <span className="calendar-title">{currentMonthName} {toPersianNumber(selectedDate.year)}</span>
              </div>
              <div className="calendar-grid">
                {daysArray.map((day) => (
                  <div
                    key={day}
                    className={`calendar-day ${selectedDate.day === day ? 'calendar-day-selected' : ''}`}
                    onClick={() => setSelectedDate((prev) => ({ ...prev, day }))}
                    style={{ cursor: 'pointer' }}
                  >
                    {toPersianNumber(day)}
                  </div>
                ))}
              </div>
            </div>

            <div className="filters-section">
              <div className="filter-header" onClick={() => toggleSection('myCalendars')}>
                <SlCalender className="icon" />
                <span className="filter-title">تقویم های من</span>
                {openSections.myCalendars ? <FaChevronUp className="icon" /> : <FaChevronDown className="icon" />}
              </div>
              {openSections.myCalendars && (
                <div className="filter-options">
                  {['تقویم شخصی', 'تاریخ های مهم', 'تقویم دانشگاه'].map((label) => (
                    <label key={label} className="filter-option">
                      <div className="checkbox"></div>
                      <span className="filter-label">{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="filters-section">
              <div className="filter-header" onClick={() => toggleSection('myActivities')}>
                <SlCalender className="icon" />
                <span className="filter-title">فعالیت های من</span>
                {openSections.myActivities ? <FaChevronUp className="icon" /> : <FaChevronDown className="icon" />}
              </div>
              {openSections.myActivities && (
                <div className="filter-options">
                  {['فراز های ملاقات', 'تسک ها', 'جلسات کاری'].map((label) => (
                    <label key={label} className="filter-option">
                      <div className="checkbox"></div>
                      <span className="filter-label">{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="middle-content" style={{ order: 1 }}>
            <div className="middle-header">
              <div className="date-display">
                <h2>
                  {weekdayName} - {toPersianNumber(selectedDate.day)} {currentMonthName}{' '}
                  {toPersianNumber(selectedDate.year)}
                </h2>
                <p>{gregorianDate}</p>
              </div>
              <div className="header-icons">
                <SlShare className="icon" />
                <SlMagnifier className="icon" />
              </div>
            </div>

            <div className="events-container">
              <div className="hour-column">
                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="hour-marker">
                    {toPersianNumber(hour.toString().padStart(2, '0'))}:۰۰
                  </div>
                ))}
              </div>

              <div className="events-list" style={{ position: 'relative', height: '1440px' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>در حال بارگذاری...</div>
                ) : tasks.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
                    هیچ تسکی برای این روز وجود ندارد.
                  </div>
                ) : (
                  tasks.map((task) => {
                    const [hour, minute] = task.time.split(':').map(Number);
                    const topPosition = hour * 60 + minute;

                    return (
                      <div
                        key={task.id}
                        className={`event-card event-category-${task.category}`}
                        style={{
                          position: 'absolute',
                          top: `${topPosition}px`,
                          width: 'calc(100% - 10px)',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: task.category === 1 ? '#ffffffff' : task.category === 2 ? '#f3e5f5' : '#fff3e0',
                          borderLeft: '4px solid',
                          borderColor: task.category === 1 ? '#18df8fff' : task.category === 2 ? '#9c27b0' : '#ff9800',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div className="event-time" style={{ fontWeight: 'bold', fontSize: '0.9em' }}>
                              {toPersianNumber(task.time)}
                            </div>
                            <div className="event-title">{task.title}</div>
                            {task.description && (
                              <div className="event-description" style={{ fontSize: '0.8em', color: '#666', marginTop: '4px' }}>
                                {task.description}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => startEdit(task)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#4CAF50',
                                fontSize: '14px',
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#f44336',
                                fontSize: '14px',
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;