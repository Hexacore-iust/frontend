import React, { useState } from "react";
import { baseUrl } from "../../../config";
import DatePicker from "../../DatePicker/DatePicker";
import Button from "@mui/material/Button";
import axios from "axios";

const DashboardFilterTasks = (props) => {
  const { title, upcomingTasks } = props;
  const token = localStorage.getItem("token");

  const [date, setDate] = useState({
    start: new Date(),
    end: new Date(),
  });

  const handleChangeStart = (value) => {
    setDate((prev) => ({
      ...prev,
      start: value,
    }));
  };

  const handleChangeEnd = (value) => {
    setDate((prev) => ({
      ...prev,
      end: value,
    }));
  };

  const toUtcMidnightISOString = (value) => {
    if (!value) return null;

    const d = value instanceof Date ? value : new Date(value);

    // Use UTC year/month/day and set time to 00:00:00 UTC
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0)
    ).toISOString();
  };

  const getUpcomingTasks = (start, end) => {
    return axios
      .post(
        `${baseUrl}/api/homepage/statistics/range/upcoming-meetings/`,
        {
          start,
          end,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("upcoming tasks in range:", res.data);
        return res.data;
      });
  };
  const handleSubmitDate = () => {
    getUpcomingTasks(
      toUtcMidnightISOString(date.start),
      toUtcMidnightISOString(date.end)
    );
  };

  return (
    <div className="task-blocks">
      <div className="task-blocks__statistic-box">
        <div className="task-blocks__statistic-box__text">
          <h3>{title}</h3>
          <p style={{ color: "#FF8D28" }}>{upcomingTasks}</p>
        </div>
        <div className="task-blocks__statistic-box__date">
          <DatePicker
            dateValue={date.start}
            handleChangeDate={handleChangeStart}
            label={"از"}
            fullWidth={false}
          />
          <DatePicker
            dateValue={date.end}
            label={"تا"}
            fullWidth={false}
            handleChangeDate={handleChangeEnd}
          />
        </div>
        <Button
          onClick={handleSubmitDate}
          variant="contained"
          style={{
            backgroundColor: "#00c48c",
          }}
        >
          مشاهده بیشتر{" "}
        </Button>
      </div>
    </div>
  );
};

export default DashboardFilterTasks;
