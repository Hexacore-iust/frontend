import React, { useState } from "react";
import { FaHome, FaUserAlt, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import "./SideBar.scss";

const SideBar = (props) => {
  const { sidebarRef } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--closed"}`}
      ref={sidebarRef}
    >
      <div className="sidebar__header">
        <h2 className="sidebar__title">داشبورد</h2>
        <button className="sidebar__toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoCloseSharp size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          <li className="sidebar__item">
            <FaHome size={24} />
            <span className="sidebar__item-label">خانه</span>
          </li>
          <li className="sidebar__item">
            <FaUserAlt size={24} />
            <span className="sidebar__item-label">پروفایل</span>
          </li>
          <li className="sidebar__item">
            <FaCog size={24} />
            <span className="sidebar__item-label">دستیار هوشمند</span>
          </li>
          <li className="sidebar__item">
            <FaSignOutAlt size={24} />
            <span className="sidebar__item-label">برنامه ها</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
