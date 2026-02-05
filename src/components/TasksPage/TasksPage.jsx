import React, { useState, useEffect } from 'react';
import './TasksPage.styles.scss';
import {
  FaPlus, FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp,
  FaEdit, FaUserFriends, FaTrash, FaTimes
} from 'react-icons/fa';
import { SlCalender, SlMagnifier, SlShare } from 'react-icons/sl';
import PersianDate from 'persian-date';
import { tokenStorage, apiInstance } from "../../api/axios.js";

// Handles { message, task: { ... } } or direct task
const normalizeTask = (task) => {
  const actualTask = task.task || task;

  let timeStr = '00:00';

  if (actualTask.time && typeof actualTask.time === 'string') {
    // If backend sends ISO datetime: "2026-02-04T16:30:00Z"
    if (actualTask.time.includes('T')) {
      const dateObj = new Date(actualTask.time);

      const pad = (n) => String(n).padStart(2, '0');
      timeStr = `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
    } else {
      // If backend sends only "16:30"
      const match = actualTask.time.match(/^(\d{2}):(\d{2})/);
      if (match) timeStr = `${match[1]}:${match[2]}`;
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

  useEffect(() => {
    const handleRipple = (e) => {
      const button = e.currentTarget;
      if (!button.classList.contains('ripple-container')) return;
      
      const existingRipples = button.querySelectorAll('.ripple');
      existingRipples.forEach(ripple => ripple.remove());
      
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
    
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    };
    
    const targetButtons = Array.from(document.querySelectorAll('button'))
      .filter(btn => 
        ['انصراف', 'اضافه کردن', 'ایجاد', 'بله، حذف شود'].includes(
          btn.textContent.trim().replace(/\u200c/g, ' ') // نرمال‌سازی فاصله‌نیم‌فاصله
        )
      );
    
    targetButtons.forEach(btn => {
      btn.classList.add('ripple-container');
      btn.addEventListener('click', handleRipple);
    });
    
    return () => {
      targetButtons.forEach(btn => {
        btn.classList.remove('ripple-container');
        btn.removeEventListener('click', handleRipple);
      });
    };
  }, [isModalOpen, deleteTask]); 

  // ✅ تشخیص همپوشانی بر اساس محدوده زمانی (با فرض طول 30 دقیقه‌ای)
  const tasksWithOverlapInfo = React.useMemo(() => {
    if (tasks.length === 0) return [];
    
    // تبدیل زمان‌ها به دقیقه از اول روز
    const tasksWithMinutes = tasks.map(task => {
      const [hour, minute] = task.time.split(':').map(Number);
      const startMinutes = hour * 60 + minute;
      return {
        ...task,
        startMinutes,
        endMinutes: startMinutes + 82 // فرض طول 30 دقیقه‌ای
      };
    });

    // گروه‌بندی تسک‌های همپوشان
    const groups = [];
    let currentGroup = [];
    let currentMaxEnd = -Infinity;

    tasksWithMinutes.sort((a, b) => a.startMinutes - b.startMinutes);

    tasksWithMinutes.forEach(task => {
      if (task.startMinutes < currentMaxEnd) {
        currentGroup.push(task);
        currentMaxEnd = Math.max(currentMaxEnd, task.endMinutes);
      } else {
        if (currentGroup.length > 0) groups.push(currentGroup);
        currentGroup = [task];
        currentMaxEnd = task.endMinutes;
      }
    });

    if (currentGroup.length > 0) groups.push(currentGroup);

    // اضافه کردن اطلاعات گروه به هر تسک
    return tasksWithMinutes.map(task => {
      const group = groups.find(g => g.some(t => t.id === task.id));
      return {
        ...task,
        groupSize: group ? group.length : 1,
        groupIndex: group ? group.indexOf(task) : 0,
      };
    });
  }, [tasks]);

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

      // ✅ استفاده از apiInstance با پارامترهای استاندارد
      const response = await apiInstance.get('/api/tasks/', {
        params: {
          time_after: gDateString,
          time_before: nextDayString
        }
      });

      const rawData = response.data;
      const tasksArray = rawData.tasks || rawData;
      const taskList = Array.isArray(tasksArray) ? tasksArray : [tasksArray];
      const normalizedTasks = taskList.map(normalizeTask);
      setTasks(normalizedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      
      // ✅ مدیریت هوشمند خطاها توسط اینترسپتورها
      if (error.response?.status === 401) {
        // اینترسپتور قبلاً توکن‌ها را پاک کرده - فقط نمایش پیام
        alert('نشست شما منقضی شده. لطفاً مجدداً وارد شوید.');
        // اختیاری: هدایت به صفحه لاگین
        // window.location.href = '/login';
      } else {
        const msg = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    error.message || 
                    'خطا در دریافت فعالیت‌ها';
        alert(`خطا: ${msg}`);
      }
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

    try {
      const pDate = new PersianDate([
        selectedDate.year,
        selectedDate.month,
        selectedDate.day,
      ]);
      const gDate = pDate.toDate();
      const [hours, minutes] = taskData.time.split(':').map(Number);
      const localDateTime = new Date(gDate);
      localDateTime.setHours(hours, minutes, 0, 0);
      const utcDatetime = localDateTime.toISOString();

      const payload = {
        title: taskData.title,
        description: taskData.description,
        time: utcDatetime,
        category: parseInt(taskData.category),
      };

      // ✅ حذف چک دستی توکن و استفاده از apiInstance
      let response;
      if (editTask) {
        response = await apiInstance.patch(`/api/tasks/${editTask.id}/update/`, payload);
      } else {
        response = await apiInstance.post('/api/tasks/create/', payload);
      }

      const savedTask = response.data;
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
      
      if (error.response?.status === 401) {
        alert('نشست شما منقضی شده. لطفاً مجدداً وارد شوید.');
        return;
      }
      
      // پردازش خطاهای اعتبارسنجی
      if (error.response?.data) {
        const errorData = error.response.data;
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
        alert(`خطا:\n${errorMessage}`);
      } else {
        alert('خطای شبکه یا سرور. لطفاً دوباره تلاش کنید.');
      }
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
      // ✅ استفاده از apiInstance بدون مدیریت دستی هدر
      await apiInstance.delete(`/api/tasks/${deleteTask.id}/delete/`);
      setTasks(prev => prev.filter(t => t.id !== deleteTask.id));
      setDeleteTask(null);
    } catch (error) {
      console.error('Delete error:', error);
      
      if (error.response?.status === 401) {
        alert('نشست شما منقضی شده. لطفاً مجدداً وارد شوید.');
      } else {
        const msg = error.response?.data?.detail || 
                    'حذف فعالیت با خطا مواجه شد';
        alert(`خطا: ${msg}`);
      }
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
              <h3>{editTask ? 'ویرایش فعالیت' : 'ایجاد فعالیت جدید'}</h3>
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
                <label>عنوان فعالیت:</label>
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
                <label>زمان:</label>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  alignItems: 'center', 
                  width: '100%',
                  marginTop: '4px'
                }}>
                  {/* Minute Dropdown */}
                  <select
                    value={((editTask ? editTask.time : newTask.time) || '00:00').split(':')[1]}
                    onChange={(e) => {
                      const minute = e.target.value;
                      const currentTime = (editTask ? editTask.time : newTask.time) || '00:00';
                      const hour = currentTime.split(':')[0] || '00';
                      const newTime = `${hour}:${minute}`;
                      if (editTask) {
                        setEditTask({ ...editTask, time: newTime });
                      } else {
                        setNewTask({ ...newTask, time: newTime });
                      }
                    }}
                    required
                    style={{
                      width: '45%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      direction: 'rtl',
                      fontFamily: 'inherit',
                      textAlign: 'center'
                    }}
                  >
                    {Array.from({ length: 60 }, (_, i) => {
                      const val = i.toString().padStart(2, '0');
                      return (
                        <option key={i} value={val} style={{ direction: 'rtl' }}>
                          {toPersianNumber(val)}
                        </option>
                      );
                    })}
                  </select>

                  <span style={{ fontSize: '1.3em', fontWeight: 'bold' }}>:</span>

                  {/* Hour Dropdown */}
                  <select
                    value={((editTask ? editTask.time : newTask.time) || '00:00').split(':')[0]}
                    onChange={(e) => {
                      const hour = e.target.value;
                      const currentTime = (editTask ? editTask.time : newTask.time) || '00:00';
                      const minute = currentTime.split(':')[1] || '00';
                      const newTime = `${hour}:${minute}`;
                      if (editTask) {
                        setEditTask({ ...editTask, time: newTime });
                      } else {
                        setNewTask({ ...newTask, time: newTime });
                      }
                    }}
                    required
                    style={{
                      width: '45%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      direction: 'rtl',
                      fontFamily: 'inherit',
                      textAlign: 'center'
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const val = i.toString().padStart(2, '0');
                      return (
                        <option key={i} value={val} style={{ direction: 'rtl' }}>
                          {toPersianNumber(val)}
                        </option>
                      );
                    })}
                  </select>        
                </div>
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
                  className='transition-button'
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
                  className='transition-button'
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
              <h3>تأیید حذف فعالیت</h3>
              <button
                type="button"
                onClick={() => setDeleteTask(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <FaTimes />
              </button>
            </div>
            <p style={{ marginBottom: '20px', textAlign: 'center' }}>
              آیا از حذف فعالیت «<strong>{deleteTask.title}</strong>» در ساعت {toPersianNumber(deleteTask.time)} اطمینان دارید؟
              <br />
              <span style={{ color: '#f44336', fontSize: '0.9em' }}>این عمل قابل بازگشت نیست.</span>
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeleteTask(null)}
                className='transition-button'
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
                className='transition-button'
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
              className="add-button transition-button"
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
              <span style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>اضافه کردن</span>
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
                    style={{ cursor: 'pointer', marginTop: '3px' }}
                  >
                    {toPersianNumber(day)}
                  </div>
                ))}
              </div>
            </div>

            <div className="filters-section">
              <div className="filter-header" onClick={() => toggleSection('myCalendars')}>
                <SlCalender className="icon" />
                <span className="filter-title">تقویم‌های من</span>
                {openSections.myCalendars ? <FaChevronUp className="icon" /> : <FaChevronDown className="icon" />}
              </div>
              {openSections.myCalendars && (
                <div className="filter-options">
                  {['تقویم شخصی', 'تاریخ‌های مهم', 'تقویم دانشگاه'].map((label) => (
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
                <span className="filter-title">فعالیت‌های من</span>
                {openSections.myActivities ? <FaChevronUp className="icon" /> : <FaChevronDown className="icon" />}
              </div>
              {openSections.myActivities && (
                <div className="filter-options">
                  {['قرارهای ملاقات', 'فعالیت‌ها', 'جلسات کاری'].map((label) => (
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
                <p style={{marginTop: '2px'}}>{gregorianDate}</p>
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
                ) : tasksWithOverlapInfo.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
                    هیچ فعالیتی برای این روز وجود ندارد.
                  </div>
                  ) : (
                    tasksWithOverlapInfo.map((task) => {
                    const topPosition = task.startMinutes;
                    
                    // ✅ تشخیص همپوشانی
                    const isOverlapping = task.groupSize > 1;
                    
                    // ✅ محاسبه عرض و موقعیت با فاصله 4px بین کارت‌ها برای نمایش بهتر گوشه‌های گرد
                    const gap = 4; // فاصله بین کارت‌ها برای دیدن واضح گوشه‌های گرد
                    const cardWidth = isOverlapping 
                      ? `calc((100% - ${(task.groupSize - 1) * gap}px) / ${task.groupSize})`
                      : 'calc(100% - 10px)';
                    
                    const cardLeft = isOverlapping
                      ? `calc(${task.groupIndex} * (${cardWidth} + ${gap}px))`
                      : '0';

                    // ✅ همیشه چهار گوشه گرد برای هر تسک
                    const borderRadius = '6px';
                    
                    // ✅ رنگ مرز چپ بر اساس دسته‌بندی
                    const borderColor = task.category === 1 ? '#18df8fff' : 
                                      task.category === 2 ? '#9c27b0' : '#ff9800';

                    return (
                      <div
                        key={task.id}
                        className={`event-card event-category-${task.category}`}
                        style={{
                          position: 'absolute',
                          top: `${topPosition}px`,
                          left: cardLeft,
                          width: cardWidth,
                          padding: '8px 10px',
                          borderRadius: borderRadius, // ✅ همیشه چهار گوشه گرد
                          borderLeft: `4px solid ${borderColor}`, // ✅ همیشه مرز چپ فعال
                          backgroundColor: task.category === 1 ? '#ffffffff' : 
                                        task.category === 2 ? '#f3e5f5' : '#fff3e0',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          // ✅ فاصله بین کارت‌ها برای نمایش واضح گوشه‌های گرد
                          marginRight: isOverlapping && task.groupIndex < task.groupSize - 1 ? `${gap}px` : '0',
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