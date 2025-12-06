import React, { useState, useRef, useEffect } from "react";

import Header from "../components/Header";
import SideBar from "../components/SideBar/SideBar";
import ChatPage from "../components/Chat/component1"; // صفحه چت
import Footer from "../components/Footer";

// آیتم‌های منو سایدبار
import { FaHome, FaUserAlt, FaRobot, FaTasks } from "react-icons/fa";
import { MdChat } from "react-icons/md";

const Chat = () => {
  const [contentType, setContentType] = useState("chat"); // شروع با صفحه چت
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
      id: "chat",
      label: "چت",
      icon: MdChat,
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
    case "chat":
      content = <ChatPage />; // صفحه چت
      break;
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

export default Chat;
