import React from "react";
import logo from "../assets/Logo.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

export default function Header() {
  return (
    <>
      {/* فونت وزیرمتن */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
      />

      <AppBar
        position="sticky"
        sx={{
          bgcolor: "#D1FADF",
          boxShadow: "none",
          borderRadius: "12px",
          mt: 2,
          px: 2,
          fontFamily: "Vazirmatn, sans-serif",
          direction: "rtl",
        }}
      >
        <Toolbar
          sx={{
            minHeight: 56,
            px: { xs: 1, md: 3 },
            justifyContent: "flex-end", // ⬅️ همه‌چی سمت راست
          }}
        >
          {/* لوگو + اسم */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                color: "#357a6e",
                fontFamily: "Vazirmatn, sans-serif",
                fontSize: { xs: "1rem", md: "1.2rem" },
                whiteSpace: "nowrap",
              }}
            >
              هوشیار
            </Typography>

            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: { xs: 40, md: 55 },
                height: { xs: 40, md: 55 },
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
