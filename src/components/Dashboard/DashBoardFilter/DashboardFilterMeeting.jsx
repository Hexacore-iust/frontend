import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../config";
import DatePicker from "../../DatePicker/DatePicker";
import Button from "@mui/material/Button";

const DashboardFilterMeeting = (props) => {
  const { title, upcomingMeetings } = props;
  const token = JSON.parse(localStorage.getItem("token"));

  const [date, setDate] = useState({
    start: new Date(),
    end: new Date(),
  });
  console.log("start", date.start);

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

  const getUpcomingMeetings = (start, end) => {
    return axios
      .post(
        `${baseUrl}/api/homepage/statistics/range/upcoming-meetings/`,
        {
          start,
          end,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
    getUpcomingMeetings(
      toUtcMidnightISOString(date.start),
      toUtcMidnightISOString(date.end)
    );
  };

  return (
    <div className="task-blocks">
      <div className="task-blocks__statistic-box">
        <div className="task-blocks__statistic-box__text">
          <h3>{title}</h3>
          <p style={{ color: "#FF8D28" }}>{upcomingMeetings}</p>
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

export default DashboardFilterMeeting;
