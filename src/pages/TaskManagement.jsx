import React from "react";

import Header from "../components/Header";
import ScheduleDateBar from "../components/TaskManagement/component1";

import { Container, Box } from "@mui/material";

const Task = () => {
  return (
    <>
      {/* هدر که از قبل داری */}
      <Header />

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {/* کامپوننت نوار تاریخ + سرچ */}
        <ScheduleDateBar />

        {/* اینجا محل قرار گرفتن بقیه 3 کامپوننتی هست که بعداً می‌سازیم */}
        <Box sx={{ mt: 3 }}>
          {/* <EventsList /> */}
          {/* <CalendarSidebar /> */}
          {/* <ProgramsPanel /> */}
        </Box>
      </Container>
    </>
  );
};

export default Task;
