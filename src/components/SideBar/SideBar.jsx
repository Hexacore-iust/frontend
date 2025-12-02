import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaUserAlt, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import "./SideBar.scss";

const SideBar = (props) => {
  const navItems = [
    { id: "home", label: "خانه", icon: FaHome, path: "/homepage" },
    { id: "profile", label: "پروفایل", icon: FaUserAlt, path: "/profile" },
    {
      id: "assistant",
      label: "دستیار هوشمند",
      icon: FaCog,
      path: "/assistant",
    },
    { id: "apps", label: "برنامه ها", icon: FaSignOutAlt, path: "/tasks" },
  ];

  const { sidebarRef } = props;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    navigate(path);
  };
  const isActive = (path) => location.pathname === path;

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
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className={`sidebar__item ${
                  isActive(item.path) ? "sidebar__item--active" : ""
                }`}
                onClick={() => handleNavClick(item.path)}
              >
                <Icon size={26} />
                <span className="sidebar__item-label">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
