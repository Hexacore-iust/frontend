import React, { useState } from "react";
// import { baseUrl } from "../../config";
import DatePicker from "../../DatePicker/DatePicker";
import Button from "@mui/material/Button";

const DashboardFilterMeeting = (props) => {
  const { title, upcomingMeetings } = props;

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
  );
};

export default DashboardFilterMeeting;
