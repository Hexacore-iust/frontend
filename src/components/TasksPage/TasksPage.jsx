import React, { useState, useEffect } from 'react';
import './TasksPage.styles.scss';
import {
  FaPlus, FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp, FaEdit, FaUserFriends
} from 'react-icons/fa';
import { SlCalender, SlMagnifier, SlShare } from 'react-icons/sl';
import PersianDate from 'persian-date';

const TasksPage = () => {

  // Convert numbers to Persian digits
  const toPersianNumber = (num) => {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
  };

  // Open/close filter sections
  const [openSections, setOpenSections] = useState({
    myCalendars: true,
    myActivities: true,
  });

  // Selected date (Persian calendar)
  const [selectedDate, setSelectedDate] = useState({
    year: null,
    month: null,
    day: null,
  });

  // === ⬇️ Set today's date when component loads
  useEffect(() => {
    const today = new PersianDate(); // Today's date in Persian calendar
    const y = today.year();
    const m = today.month();
    const d = today.date();

    setSelectedDate({
      year: y,
      month: m,
      day: d
    });
  }, []);
  // === ⬆️ End setting today's date

  // Toggle open/close for a section
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get number of days in a Persian month
  const getDaysInMonth = (year, month) => {
    const pDate = new PersianDate([year, month, 1]);
    return pDate.daysInMonth();
  };

  // Change month (next or previous)
  const changeMonth = (direction) => {
    setSelectedDate((prev) => {
      let newYear = prev.year;
      let newMonth = prev.month + direction;

      // Adjust year when crossing boundaries
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }

      // Ensure selected day exists in the new month
      const maxDay = getDaysInMonth(newYear, newMonth);
      const newDay = prev.day <= maxDay ? prev.day : 1;

      return { year: newYear, month: newMonth, day: newDay };
    });
  };

  // Persian month names
  const persianMonths = [
    '',
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
    'مرداد', 'شهریور', 'مهر', 'آبان',
    'آذر', 'دی', 'بهمن', 'اسفند',
  ];

  // Do not render until date is loaded
  if (!selectedDate.year) return null;

  const currentMonthName = persianMonths[selectedDate.month];
  const daysInMonth = getDaysInMonth(selectedDate.year, selectedDate.month);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Mocked list of today's events
  const todayEvents = [
    { id: 1, title: 'بازگذاری تمرین', time: '11:00', type: 'meeting', icon: <FaEdit /> },
    { id: 2, title: 'بازگذاری تمرین', time: '12:00', type: 'meeting', icon: <FaEdit /> },
    { id: 3, title: 'تماس با استاد', time: '16:00', type: 'call', icon: <FaEdit /> },
    { id: 4, title: 'جلسه با رییس تیم', time: '19:00', type: 'team', icon: <FaUserFriends /> },
  ];

  // Convert Persian date to Gregorian (English format)
  const getGregorianDate = (year, month, day) => {
    const pDate = new PersianDate([year, month, day]);
    const gDate = pDate.toDate();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return gDate.toLocaleDateString('en-US', options);
  };

  // Get weekday name in Persian (e.g., شنبه, یکشنبه)
  const getWeekdayName = (year, month, day) => {
    const pDate = new PersianDate([year, month, day]);
    return pDate.format('dddd');
  };

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
      <div className="tm-container">
        <div className="tm-main-content">

          {/* Sidebar */}
          <div className="tm-sidebar" style={{ order: 2 }}>
            <button className="add-button">
              <FaPlus style={{ marginLeft: '5px' }} />
              <span>اضافه کردن</span>
            </button>

            {/* Calendar Section */}
            <div className="calendar-section">
              <div className="calendar-header">
                <div className="calendar-nav">
                  {/* Next Month */}
                  <div className="calendar-nav-btn" onClick={() => changeMonth(1)}>
                    <FaChevronRight className="icon" />
                  </div>

                  {/* Previous Month */}
                  <div className="calendar-nav-btn" onClick={() => changeMonth(-1)}>
                    <FaChevronLeft className="icon" />
                  </div>
                </div>

                <span className="calendar-title">
                  {currentMonthName} {toPersianNumber(selectedDate.year)}
                </span>
              </div>

              {/* Days Grid */}
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

            {/* Calendar Filters */}
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

            {/* Activity Filters */}
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

          {/* Main (Middle) Content */}
          <div className="middle-content" style={{ order: 1 }}>

            {/* Header Section */}
            <div className="middle-header">
              <div className="date-display">
                <h2>
                  {weekdayName} - {toPersianNumber(selectedDate.day)} {currentMonthName} {toPersianNumber(selectedDate.year)}
                </h2>
                <p>{gregorianDate}</p>
              </div>

              <div className="header-icons">
                <SlShare className="icon" />
                <SlMagnifier className="icon" />
              </div>
            </div>

            {/* Timeline + Events */}
            <div className="events-container">

              {/* Hours Column */}
              <div className="hour-column">
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = (i + 6) % 24; // Starts at 6 AM
                  return (
                    <div key={i} className="hour-marker">
                      {toPersianNumber(hour.toString().padStart(2, '0'))}:۰۰
                    </div>
                  );
                })}
              </div>

              {/* Events Positioned on Timeline */}
              <div className="events-list">
                {todayEvents.map((event) => {
                  const [hour, minute] = event.time.split(':').map(Number);
                  const topPosition = hour * 60 + minute; // Convert time to pixel position

                  return (
                    <div
                      key={event.id}
                      className={`event-card event-${event.type}`}
                      style={{ top: `${topPosition}px` }}
                    >
                      <div className="event-time">{toPersianNumber(event.time)}</div>

                      <div className="event-body">
                        <div className="event-title">{event.title}</div>
                        <div className="event-icon">{event.icon}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TasksPage;
