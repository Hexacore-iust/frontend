import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import "./SideBar.styles.scss";

const SideBar = (props) => {
  const { sidebarRef, navItems, handleNavClick, contentType } = props;
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
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className={`sidebar__item
                    ${contentType === item.id ? "sidebar__item--active" : ""}`}
                onClick={() => handleNavClick(item.id)}
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
