import React from "react";
// import { useEffect } from "react";
// import { baseUrl } from "../../config";
// import axios from "axios";
import { statistics, scheduleToday } from "../../homepage-mockdata";
import "./Dashboard.styles.scss";
import CustomAccordion from "../Accordion/CustomAccordion";

const Dashboard = () => {
  const { schedule } = scheduleToday;
  // const token = localStorage.getItem("token");
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NTM3NTEzOSwiaWF0IjoxNzY0NzcwMzM5LCJqdGkiOiI5ODdjZTRlNGVjYWM0YjQ3ODY2OWI4MmVmYTE2NWQzNiIsInVzZXJfaWQiOjF9.82Prhk5Fr_Qzj6OyOxkSyh27YyAd3x_Zh4MudjQV7AU";

  // const getDashboard = () => {
  //   axios({
  //     method: "get",
  //     headers: { Authorization: `Bearer ${token}` },
  //     url: `${baseUrl}/api/homepage/`,
  //     responseType: "application/json",
  //   }).then(function (response) {
  //     console.log("res", response);
  //   });
  // };

  // useEffect(() => {
  //   getDashboard();
  // }, []);

  return (
    <div className="content-wrapper">
      <div className="text-blocks">
        <h1>هوشیار !</h1>
        <h3>برنامه ریزی کن</h3>
      </div>
      <div className="task-blocks">
        {/* Task, Meeting, Action Blocks */}
        <div className="task-blocks__statistic-box">
          <h4>قرار های پیش رو</h4>
          <p>{statistics.upcoming_meetings}</p>
        </div>
        <div className="task-blocks__statistic-box">
          <h4>کار های پیش رو</h4>
          <p>{statistics.upcoming_tasks}</p>
        </div>
        <div className="task-blocks__statistic-box">
          <h4>کار های باقی مانده</h4>
          <p>{statistics.overdue_tasks}</p>
        </div>
      </div>

      <div className="today-plan">
        <h3>برنامه امروز من:</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {schedule.map((item) => {
            return (
              <CustomAccordion
                summary={item.title}
                detailsChildren={
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexDirection: "column",
                      color: "#777",
                    }}
                  >
                    <div>{item.description}</div>
                    <div>
                      {item.start_time} {item.end_time}
                    </div>
                    <div>{item.time}</div>
                  </div>
                }
                hasAction={false}
                color={item.category.color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
