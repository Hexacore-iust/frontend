import React, { useState, useRef, useEffect } from "react";

import Header from "../components/Header";
import SideBar from "../components/SideBar/SideBar";
import ChatPage from "../components/Chat/component1"; // صفحه چت
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard/Dashboard";

// آیتم‌های منو سایدبار
import { FaHome, FaUserAlt, FaRobot, FaTasks } from "react-icons/fa";

const Chat = () => {
  const [contentType, setContentType] = useState("assistant"); // شروع با دستیار
  const [width, setWidth] = useState(0);
  const elementRef = useRef(null);

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
      content = <Dashboard />; // فقط داشبورد
      break;

    case "assistant":
      // ✅ داشبورد و صفحه چت در یک خط کنار هم
      content = (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            height: "100%",
          }}
        >
          <div style={{ flex: 1 }}>
            <Dashboard />
          </div>
          <div style={{ flex: 1 }}>
            <ChatPage />
          </div>
        </div>
      );
      break;

    case "profile":
      content = <></>; // محتوای پروفایل
      break;

    case "tasks":
      content = <></>; // محتوای تسک‌ها
      break;

    default:
      content = <Dashboard />;
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
        <div style={{ flexGrow: 1, height: "100vh" }}>{content}</div>
      </div>

      {/* فوتر ثابت */}
      <div style={{ position: "relative", zIndex: "1" }}>
        <Footer />
      </div>
    </div>
  );
};

export default Chat;
