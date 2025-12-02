import React, { useRef, useState, useEffect } from "react";
import "./HomePage.scss";
import SideBar from "../SideBar/SideBar";
import HomeHeader from "../Header";
import Footer from "../Footer";

const HomePage = () => {
  const elementRef = useRef(null);
  const [width, setWidth] = useState(0);
  const updateWidth = () => {
    if (elementRef.current) {
      setWidth(elementRef.current?.clientWidth);
    }
  };

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
          <SideBar sidebarRef={elementRef} />
        </div>
        <div
          style={{
            // marginRight: `${width}px`,
            width: "100%",
            height: "100vh",
          }}
        >
          content
        </div>
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
