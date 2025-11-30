import React from "react";
import { Grid, Box, Typography, Stack } from "@mui/material";
import landing from "../../assets/Landing.png";



const textBase = {
  fontSize: { xs: 12, sm: 13, md: 14, lg: 15 },
  lineHeight: 1.9,
  textAlign: "center", // ⬅ وسط‌چین
  fontFamily: "Vazirmatn, sans-serif", // ⬅ فونت مثل هدر و فوتر
};

export default function HeroSection() {
  return (
    <>
      {/* فونت وزیر جهت یکپارچگی */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
      />

      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center" // ⬅ کل سکشن وسط
        sx={{
          mt: { xs: 4, md: 1.5 },
          mb: { xs: 4, md: 1.5 },
          px: { xs: 2, md: 3 },
          width: "100%",
          maxWidth: "100%",
          bgcolor: "#E2F3EF",
          fontFamily: "Vazirmatn, sans-serif", // ⬅ فونت ثابت
          direction: "rtl",
          
        }}
      >
        {/* تصویر */}
        <Grid item xs={12} md={6} textAlign="center">
          <Box
            sx={{
              bgcolor: "#E2F3EF",
              borderRadius: 4,
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "100%",
            }}
          >
            <Box
              component="img"
              src={landing}
              alt="هوشیار - دستیار برنامه‌ریزی"
              sx={{
                width: "100%",
                maxWidth: 420,
                height: "auto",
              }}
            />
          </Box>
        </Grid>

        {/* متن */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2} sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                color: "#faa124ff",
                fontWeight: 600,
                fontSize: { xs: "1rem", md: "2.5rem" },
                fontFamily: "Vazirmatn, sans-serif",
              }}
            >
              هوشیار؛
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.3rem", md: "1.7rem" },
                color: "#1a6964ff",
                fontFamily: "Vazirmatn, sans-serif",
              }}
            >
              هوشمندانه‌ترین راه برای برنامه‌ریزی
            </Typography>

            <Typography
              sx={{
                ...textBase,
                color: "#357A6E",
                maxWidth: 480,
                mx: "auto",
              }}
            >
              ایجنت هوش مصنوعی که تو را می‌شناسد،
              با تو فکر می‌کند و برایت بهترین مسیر را طراحی می‌کند
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
