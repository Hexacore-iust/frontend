import React, { useState } from "react";
import { useEffect } from "react";
import { baseUrl } from "../../config";
import axios from "axios";
import { scheduleToday } from "../../homepage-mockdata";
import "./Dashboard.styles.scss";
import CustomAccordion from "../Accordion/CustomAccordion";
import DashboardFilterMeeting from "./DashBoardFilter/DashboardFilterMeeting";
import DashboardFilterTaskOverdue from "./DashBoardFilter/DashboardFilterTaskOverdue";
import DashboardFilterTasks from "./DashBoardFilter/DashboardFilterTasks";

const Dashboard = () => {
  const { schedule } = scheduleToday;
  const [statistics, setStatistics] = useState({
    overdue_tasks: 0,
    upcoming_tasks: 0,
    upcoming_meetings: 0,
  });
  const token = localStorage.getItem("token");

  // const getStatistic = () => {
  //   axios({
  //     method: "get",
  //     headers: { Authorization: `Bearer ${JSON.parse(token)}` },
  //     url: `${baseUrl}/api/homepage/statistics`,
  //     responseType: "application/json",
  //   }).then(function (response) {
  //     console.log("response", response);
  //     setStatistics(response);
  //   });
  // };
  // const getTodaySchedule = () => {
  //   axios({
  //     method: "get",
  //     headers: { Authorization: `Bearer ${JSON.parse(token)}` },
  //     url: `${baseUrl}/api/homepage/schedule/today`,
  //     responseType: "application/json",
  //   }).then(function (response) {
  //     const schedule = JSON.parse(response.data);
  //     console.log("tasks:", schedule.tasks);
  //     console.log("meetings:", schedule.meetings);
  //   });
  // };

  // Temp Fix
  const getStatistic = () => {
    axios({
      method: "get",
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      url: `${baseUrl}/api/homepage/statistics`,
      responseType: "application/json",
    })
      .then((response) => {
        const stats = JSON.parse(response.data);
        setStatistics(stats);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const toHM = (value) => {
    if (!value) return "";
    if (typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) return value;

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";

    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  };
  useEffect(() => {
    getStatistic();
    // getTodaySchedule();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="text-blocks">
        <h1>هوشیار !</h1>
        <h3>برنامه ریزی کن</h3>
      </div>
      <div className="task-blocks">
        <DashboardFilterMeeting
          title={"قرار های پیش رو"}
          upcomingMeetings={statistics.upcoming_meetings}
        />

        <DashboardFilterTasks
          title={"کار های پیش رو"}
          upcomingTasks={statistics.upcoming_tasks}
        />

        <DashboardFilterTaskOverdue
          title={"کار های باقی مانده"}
          upcomingTasksOverdue={statistics.overdue_tasks}
        />
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
                      {toHM(item.end_time)}
                      {item.end_time ? " - " : <></>}
                      {toHM(item.start_time)}
                    </div>
                    <div>{toHM(item.time)}</div>
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
