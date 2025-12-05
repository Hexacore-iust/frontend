import React from "react";

import Header from "../components/Header";
import ChatPage from "../components/Chat/component1";   // ← صفحه چت

import { Container, Grid, Box } from "@mui/material";

const Chat = () => {
  return (
    <>
      <Header />

      <Box
        sx={{
          bgcolor: "#EDEDED",   // پس‌زمینه صفحه مثل UI
          minHeight: "100vh",
          p: 2,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={2}>

            {/* ستون اصلی چت */}
            <Grid item xs={12} md={9}>
              <ChatPage />
            </Grid>

            {/* ستون راست داشبورد */}
            <Grid item xs={12} md={3}>
              
            </Grid>

          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Chat;
