// HomePage.jsx
import React, { useRef, useState, useEffect } from "react";
import "./HomePage.scss";
import SideBar from "../SideBar/SideBar";

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
  }, [elementRef.current]);
  console.log("width", width);
  console.log("elementRef", elementRef.current?.clientWidth);
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          height: "56px",
          backgroundColor: "black",
          zIndex: "1",
          position: "relative",
        }}
      >
        Header
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <div>
          <SideBar sidebarRef={elementRef} />
        </div>
        <div
          style={{
            marginRight: `${width}px`,
            width: "100%",
            // height: "100vh",
            backgroundColor: "blue",
          }}
        >
          content
        </div>
      </div>
      <div
        style={{
          height: "56px",
          backgroundColor: "red",
          zIndex: "1",
          position: "relative",
        }}
      >
        footer
      </div>
    </div>
    // <div className="main-content">

    // </div>
  );
};

export default HomePage;
