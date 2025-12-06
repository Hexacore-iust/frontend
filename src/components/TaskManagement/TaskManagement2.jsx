import React from 'react';
import './TaskManagement.css';

import { FaPlus, FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";

const TaskManagementPage = () => {
  return (
    <div
      style={{
        backgroundColor: '#707070',
        padding: '20px',
        direction: 'rtl',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}
    >
      <div className="container">
        <div className="main-content">
          {/* Left Sidebar */}
          <div className="sidebar">
            <button className="add-button">
              <FaPlus style={{ marginLeft: '5px' }} />
              <span>اضافه کردن</span>
            </button>

            {/* Calendar Section */}
            <div className="calendar-section">
              <div className="calendar-header">
                <div className="calendar-nav">
                  <button className="calendar-nav-btn">
                    <FaChevronRight className="icon" />
                  </button>
                  <button className="calendar-nav-btn">
                    <FaChevronLeft className="icon" />
                  </button>
                </div>
                <span className="calendar-title">آذر ۱۴۰۴</span>
              </div>
              <div className="calendar-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                   17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map(day => (
                  <div
                    key={day}
                    className={`calendar-day ${day === 1 ? 'calendar-day-selected' : ''}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Filters Section - تقویم های من */}
            <div className="filters-section">
              <div className="filter-header">
                <SlCalender className="icon" />
                <span className="filter-title">تقویم های من</span>
                <FaChevronDown className="icon" />
              </div>
              <div className="filter-options">
                {['تقویم شخصی', 'تاریخ های مهم', 'تقویم دانشگاه'].map(label => (
                  <label key={label} className="filter-option">
                    <div className="checkbox"></div>
                    <span className="filter-label">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filters Section - فعالیت های من */}
            <div className="filters-section">
              <div className="filter-header">
                <SlCalender className="icon" />
                <span className="filter-title">فعالیت های من</span>
                <FaChevronDown className="icon" />
              </div>
              <div className="filter-options">
                {['فراز های ملاقات', 'تسک ها', 'جلسات کاری'].map(label => (
                  <label key={label} className="filter-option">
                    <div className="checkbox"></div>
                    <span className="filter-label">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagementPage;
