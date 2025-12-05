import React from "react";
import logo from "../assets/Logo.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

export default function Header() {
  const navItems = ["ارتباط با ما", "اشتراک‌ها", "قوانین و مقررات", "درباره ما"];

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
            gap: { xs: 1, md: 0 },
          }}
        >
          {/* منو – ریسپانسیو و قابل شکستن در چند خط */}
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: { xs: "center", md: "flex-start" },
              gap: { xs: 2, md: 4 },
              flexWrap: "wrap", // ← اگه جا کم شد، میره خط بعد
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: "#357a6e",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", md: "1.2rem" }, // ← کوچیک‌تر روی موبایل
                  fontFamily: "Vazirmatn, sans-serif",
                  minWidth: "auto",
                  paddingX: 0,
                  "&:hover": { color: "#0E8A62" },
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          {/* لوگو + اسم سمت راست، با سایز ریسپانسیو */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
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
              Hexacore
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
