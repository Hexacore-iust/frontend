import React from "react";
// import { useEffect } from "react";
// import { baseUrl } from "../../config";
// import axios from "axios";
import { statistics, scheduleToday } from "../../homepage-mockdata";
import "./Dashboard.styles.scss";
import dayjs from "dayjs";
import CustomAccordion from "../Accordion/CustomAccordion";
import DatePicker from "../DatePicker/DatePicker";
import Button from "@mui/material/Button";
import { colors } from "@mui/material";

const Dashboard = () => {
  const { schedule } = scheduleToday;
  const [dateStart, setDateStart] = React.useState(dayjs(Date()));
  const [dateEnd, setDateEnd] = React.useState(dayjs(Date()));
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
        <div className="task-blocks__statistic-box">
          <div className="task-blocks__statistic-box__text">
            <h3>قرار های پیش رو</h3>
            <p style={{ color: "#FF8D28" }}>{statistics.upcoming_meetings}</p>
          </div>
          <div className="task-blocks__statistic-box__date">
            <DatePicker
              dateValue={dateStart}
              setDateValue={setDateStart}
              label={"از"}
              fullWidth={false}
            />
            <DatePicker
              dateValue={dateEnd}
              setDateValue={setDateEnd}
              label={"به"}
              fullWidth={false}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            style={{
              backgroundColor: "#00c48c",
            }}
          >
            مشاهده بیشتر{" "}
          </Button>
        </div>
        <div className="task-blocks__statistic-box">
          <div className="task-blocks__statistic-box__text">
            <h3>کار های پیش رو</h3>
            <p style={{ color: "#6155F5" }}>{statistics.upcoming_tasks}</p>
          </div>
          <div className="task-blocks__statistic-box__date">
            <DatePicker
              dateValue={dateStart}
              setDateValue={setDateStart}
              label={"از"}
              fullWidth={false}
            />
            <DatePicker
              dateValue={dateEnd}
              setDateValue={setDateEnd}
              label={"به"}
              fullWidth={false}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            style={{
              backgroundColor: "#00c48c",
            }}
          >
            مشاهده بیشتر{" "}
          </Button>
        </div>
        <div className="task-blocks__statistic-box">
          <div className="task-blocks__statistic-box__text">
            <h3>کار های باقی مانده</h3>
            <p style={{ color: "#870305" }}>{statistics.overdue_tasks}</p>
          </div>
          <div className="task-blocks__statistic-box__date">
            <DatePicker
              dateValue={dateStart}
              setDateValue={setDateStart}
              label={"از"}
              fullWidth={false}
            />
            <DatePicker
              dateValue={dateEnd}
              setDateValue={setDateEnd}
              label={"به"}
              fullWidth={false}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            style={{
              backgroundColor: "#00c48c",
            }}
          >
            مشاهده بیشتر{" "}
          </Button>
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
