import React, { useState } from "react";
import logo from "../assets/Logo.png";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function HomeHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    "ارتباط با ما",
    "اشتراک‌ها",
    "قوانین و مقررات",
    "درباره ما",
  ];

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  return (
    <>
      {/* فونت وزیرمتن */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
      />

      <AppBar
        position="relative"
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
        <Toolbar sx={{ minHeight: 56, px: { xs: 1, md: 3 } }}>
          {/* دکمه‌های سمت راست (دسکتاپ) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1.5,
              flexShrink: 0,
            }}
          >
            {/* دکمه ورود */}
            <Button
              variant="outlined"
              // تو RTL بهتره آیکن سمت چپ متن باشه → endIcon
              endIcon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={handleLogin}
              sx={{
                borderColor: "#0ACF83",
                color: "#0ACF83",
                textTransform: "none",
                fontFamily: "Vazirmatn, sans-serif",
                px: 4,
                borderRadius: "10px",
                "& .MuiButton-endIcon": {
                  mr: 1, // فاصله استاندارد بین متن و آیکن
                  ml: 0,
                },
                "&:hover": {
                  borderColor: "#08b971",
                  bgcolor: "rgba(10,207,131,0.08)",
                },
              }}
            >
              ورود
            </Button>

            {/* دکمه ثبت نام */}
            <Button
              variant="contained"
              onClick={handleSignup}
              sx={{
                bgcolor: "#0ACF83",
                color: "#ffffff",
                textTransform: "none",
                fontFamily: "Vazirmatn, sans-serif",
                px: 4,
                borderRadius: "10px",
                "&:hover": {
                  bgcolor: "#08b971",
                },
              }}
            >
              ثبت نام
            </Button>
          </Box>

          {/* منوی وسط */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              gap: 4,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: "#357a6e",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "1.2rem",
                  fontFamily: "Vazirmatn, sans-serif",
                  "&:hover": { color: "#0E8A62" },
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          {/* لوگو + اسم سمت چپ (در RTL) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontWeight: 600,
                color: "#357a6e",
                fontFamily: "Vazirmatn, sans-serif",
                fontSize: "1.2rem",
              }}
            >
              Hexacore
            </Typography>

            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: 55,
                height: 55,
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Box>

          {/* منوی موبایل */}
          <IconButton
            sx={{
              display: { xs: "block", md: "none" },
              color: "#0A3D2E",
              ml: "auto",
            }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        {/* Drawer موبایل */}
        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: { fontFamily: "Vazirmatn, sans-serif", direction: "rtl" },
          }}
        >
          <Box sx={{ width: 260, p: 2 }}>
            <IconButton onClick={() => setOpen(false)} sx={{ mb: 1 }}>
              <CloseIcon />
            </IconButton>

            {/* دکمه‌ها در موبایل */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                mb: 2,
              }}
            >
              {/* ورود */}
              <Button
                variant="outlined"
                endIcon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => {
                  setOpen(false);
                  handleLogin();
                }}
                sx={{
                  borderColor: "#0ACF83",
                  color: "#0ACF83",
                  textTransform: "none",
                  fontFamily: "Vazirmatn, sans-serif",
                  borderRadius: "100px",
                  "& .MuiButton-endIcon": {
                    mr: 1,
                    ml: 0,
                  },
                }}
              >
                ورود
              </Button>

              {/* ثبت نام */}
              <Button
                variant="contained"
                onClick={() => {
                  setOpen(false);
                  handleSignup();
                }}
                sx={{
                  bgcolor: "#0ACF83",
                  color: "#ffffff",
                  textTransform: "none",
                  fontFamily: "Vazirmatn, sans-serif",
                  borderRadius: "100px",
                }}
              >
                ثبت نام
              </Button>
            </Box>

            <List>
              {navItems.map((item) => (
                <ListItem button key={item}>
                  <Typography>{item}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </>
  );
}
