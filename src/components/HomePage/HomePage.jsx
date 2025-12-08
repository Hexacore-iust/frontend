import React, { useRef, useState, useEffect } from "react";
import { FaHome, FaUserAlt, FaRobot, FaTasks } from "react-icons/fa";
import "./HomePage.styles.scss";
import SideBar from "../SideBar/SideBar";
import Profile from "../ProfilePage/ProfilePage";
import Dashboard from "../Dashboard/Dashboard";
import HomeHeader from "../Header";
import Footer from "../Footer";
import TasksPage from "../TasksPage/TasksPage";
import ChatPage from "../Chat/component1";

const HomePage = () => {
  const [contentType, setContentType] = useState();
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
      label: "برنامه ها",
      icon: FaTasks,
    },
  ];

  const handleNavClick = (id) => {
    setContentType(id);
  };

  const elementRef = useRef(null);
  const [width, setWidth] = useState(0);
  const updateWidth = () => {
    if (elementRef.current) {
      setWidth(elementRef.current?.clientWidth);
    }
  };
  let content;
  switch (contentType) {
    case "dashboard":
      content = <Dashboard />;
      break;
    case "profile":
      content = <Profile />;
      break;
    case "assistant":
      // content = <AssistantPage />;
      content = <ChatPage/>;
      break;
    case "tasks":
      content = <TasksPage />;
      break;
    default:
      content = <Dashboard />;
  }

  useEffect(() => {
    updateWidth();
  }, []);
  console.log("width", width);
  console.log("elementRef", elementRef.current?.clientWidth);
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "relative",
        }}
      >
        <HomeHeader />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          marginTop: "8px",
        }}
      >
        <div>
          <SideBar
            sidebarRef={elementRef}
            navItems={navItems}
            handleNavClick={handleNavClick}
            contentType={contentType}
          />
        </div>
        {/* <div
          style={{
            // marginRight: `${width}px`,
            width: "100%",
            height: "100vh",
          }}
        > */}
        {content}
        {/* </div> */}
      </div>
      <div
        style={{
          zIndex: "1",
          position: "relative",
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
