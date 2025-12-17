import React, { useState } from "react";
import DatePicker from "../../DatePicker/DatePicker";
import Button from "@mui/material/Button";
import { apiInstance } from "../../../api/axios";

const DashboardFilterTaskOverdue = (props) => {
  const { title, upcomingTasksOverdue } = props;

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

  const getUpcomingTasksOverdue = (start, end) => {
    apiInstance
      .post("/api/homepage/statistics/range/completed-tasks/", {
        start,
        end,
      })
      .then((res) => {
        console.log("upcoming tasks in range:", res.data);
        return res.data;
      });
  };

  const handleSubmitDate = () => {
    getUpcomingTasksOverdue(
      toUtcMidnightISOString(date.start),
      toUtcMidnightISOString(date.end)
    );
  };

  return (
    <div className="task-blocks">
      <div className="task-blocks__statistic-box">
        <div className="task-blocks__statistic-box__text">
          <h3>{title}</h3>
          <p style={{ color: "#FF8D28" }}>{upcomingTasksOverdue}</p>
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

export default DashboardFilterTaskOverdue;
