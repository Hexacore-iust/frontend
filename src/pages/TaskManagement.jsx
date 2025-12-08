import React, { useState, useRef, useEffect } from "react";

import Header from "../components/Header";
import SideBar from "../components/SideBar/SideBar";
import ScheduleDateBar from "../components/TaskManagement/component1"; // نوار تاریخ و سرچ
import Footer from "../components/Footer";

// آیکن‌های سایدبار
import { FaHome, FaUserAlt, FaRobot, FaTasks } from "react-icons/fa";

const Task = () => {
  const [contentType, setContentType] = useState("tasks");
  const [width, setWidth] = useState(0);
  const elementRef = useRef(null);

  // آیتم‌های سایدبار (همه آیتم‌ها بدون حذف)
  const navItems = [
    {
      id: "dashboard",
      label: "خانه",
      icon: FaHome,
    },
    {
      id: "profile",
      label: "پروفایل",
      icon: FaUserAlt,
    },
    {
      id: "assistant",
      label: "دستیار هوشمند",
      icon: FaRobot,
    },
    {
      id: "tasks",
      label: "برنامه‌ها",
      icon: FaTasks,
    },
  ];

  const handleNavClick = (id) => {
    setContentType(id);
  };

  const updateWidth = () => {
    if (elementRef.current) {
      setWidth(elementRef.current?.clientWidth);
    }
  };

  useEffect(() => {
    updateWidth();
  }, []);

  let content;
  switch (contentType) {
    case "dashboard":
      content = <></>; // محتوای داشبورد
      break;
    case "profile":
      content = <></>; // محتوای پروفایل
      break;
    case "assistant":
      content = <></>; // محتوای دستیار
      break;
    case "tasks":
      content = <></>; // محتوای تسک‌ها
      break;
    default:
      content = <></>;
  }

  return (
    <div style={{ position: "relative" }}>
      {/* هدر */}
      <div style={{ position: "relative" }}>
        <Header />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          marginTop: "8px",
        }}
      >
        {/* سایدبار */}
        <div ref={elementRef} style={{ width: "260px", flexShrink: 0 }}>
          <SideBar
            sidebarRef={elementRef}
            navItems={navItems}
            handleNavClick={handleNavClick}
            contentType={contentType}
          />
        </div>

        {/* محتوای اصلی */}
        <div style={{ flexGrow: 1, height: "100vh" }}>
          <ScheduleDateBar />
          {content}
        </div>
      </div>

      {/* فوتر ثابت */}
      <div style={{ position: "relative", zIndex: "1" }}>
        <Footer />
      </div>
    </div>
  );
};

export default Task;
