import React, { useState } from "react";
import { useEffect } from "react";
import { apiInstance } from "../../api/axios";
import "./Dashboard.styles.scss";
import CircularProgress from "@mui/material/CircularProgress";
import CustomAccordion from "../Accordion/CustomAccordion";
import DashboardFilterMeeting from "./DashBoardFilter/DashboardFilterMeeting";
import DashboardFilterTaskOverdue from "./DashBoardFilter/DashboardFilterTaskOverdue";
import DashboardFilterTasks from "./DashBoardFilter/DashboardFilterTasks";

const Dashboard = () => {
  const [schedule, setSchedule] = useState([]);
  const [filter, setFilter] = useState("");
  const [dateFilteredSchedule, setDateFilteredSchedule] = useState([]);
  const [loadingStat1, setLoadingStat1] = useState(false);
  const [loadingStat2, setLoadingStat2] = useState(false);
  const [loadingStat3, setLoadingStat3] = useState(false);
  const [loading, setLoading] = useState(false);

  const [statistics, setStatistics] = useState({
    overdue_tasks: 0,
    upcoming_tasks: 0,
    upcoming_meetings: 0,
  });

  const getStatistic = () => {
    apiInstance
      .get("/api/homepage/statistics")
      .then((response) => {
        if (response) {
          setStatistics({
            overdue_tasks: response.data.overdue_tasks,
            upcoming_tasks: response.data.upcoming_tasks,
            upcoming_meetings: response.data.upcoming_meetings,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getTodaySchedule = () => {
    setLoading(true);
    apiInstance
      .get("/api/homepage/schedule/today")
      .then((response) => {
        setSchedule(response.data.schedule);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
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
  }, []);
  useEffect(() => {
    getTodaySchedule();
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
          setDateFilteredSchedule={setDateFilteredSchedule}
          setFilter={setFilter}
          loadingStat={loadingStat1}
          setLoadingStat={setLoadingStat1}
        />

        <DashboardFilterTasks
          title={"کار های پیش رو"}
          upcomingTasks={statistics.upcoming_tasks}
          setDateFilteredSchedule={setDateFilteredSchedule}
          setFilter={setFilter}
          loadingStat={loadingStat2}
          setLoadingStat={setLoadingStat2}
        />

        <DashboardFilterTaskOverdue
          title={"کار های باقی مانده"}
          upcomingTasksOverdue={statistics.overdue_tasks}
          setDateFilteredSchedule={setDateFilteredSchedule}
          setFilter={setFilter}
          loadingStat={loadingStat3}
          setLoadingStat={setLoadingStat3}
        />
      </div>

      <div className="today-plans-wrapper">
        <div className="today-plan">
          <h3>برنامه امروز من:</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 12,
                }}
              >
                <CircularProgress
                  size={24}
                  color="inherit"
                  style={{ marginRight: 8 }}
                />
              </div>
            ) : schedule.length === 0 ? (
              <p style={{ color: "#777" }}>اطلاعاتی برای نمایش وجود ندارد</p>
            ) : (
              schedule.map((item) => {
                return (
                  <CustomAccordion
                    key={item.id}
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
              })
            )}
          </div>
        </div>
        {filter && (
          <div className="today-plan">
            <h3>{filter} </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {loadingStat1 || loadingStat2 || loadingStat3 ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                  style={{ marginRight: 8 }}
                />
              ) : dateFilteredSchedule.length === 0 ? (
                <p style={{ color: "#777" }}>اطلاعاتی برای نمایش وجود ندارد</p>
              ) : (
                dateFilteredSchedule.map((item) => {
                  return (
                    <CustomAccordion
                      key={item.id}
                      summary={item?.title}
                      detailsChildren={
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexDirection: "column",
                            color: "#777",
                          }}
                        >
                          <div>{item?.description}</div>
                          <div>
                            {toHM(item?.end_time)}
                            {item?.end_time ? " - " : <></>}
                            {toHM(item?.start_time)}
                          </div>
                          <div>{toHM(item?.time)}</div>
                        </div>
                      }
                      hasAction={false}
                      color={item?.category?.color}
                    />
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
