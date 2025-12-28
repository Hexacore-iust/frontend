import React from "react";
import { Grid, Typography, Box, Stack } from "@mui/material";

export default function MiddleSection() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: " #f2f1f1ff",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        direction: "ltr",
        py: { xs: 20, md: 20 },
        mb: { xs: 4, md: 1.5 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          px: { xs: 2, md: 4 },
        }}
      >
        {/* متن بالایی */}
        <Stack spacing={2} alignItems="center" sx={{ mb: 6 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              color: "#1a6964ff",
              fontFamily: "Vazirmatn",
              textAlign: "center",
              width: "100%",
            }}
          >
            <span style={{ color: "#faa124ff" }}>هوشیار</span> فقط یک ابزار نیست!
          </Typography>

          <Typography
            sx={{
              color: "#357A6E",
              fontFamily: "Vazirmatn",
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.9,
              maxWidth: 900,
              textAlign: "center",
              width: "100%",
            }}
          >
            یک سیستم هوشمند است که با تحلیل سبک زندگی، اهداف، عادت‌ها و اولویت‌های تو،
            برنامه‌ای قابل‌اجرا و پویا برای هر روز می‌سازد—برنامه‌ای که با تغییرات روز تو
            هماهنگ می‌شود. برای تصمیم‌گیری‌های روزمره به تو قدرت می‌دهد.
          </Typography>
        </Stack>

        {/* دو ستون پایین */}
        <Grid
          container
          spacing={6}
          justifyContent="center"
          alignItems="flex-start"
        >
          {/* ستون راست */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "#1a6964ff",
                fontWeight: 700,
                fontSize: { xs: "1.3rem", md: "1.7rem" },
                mb: 2,
                fontFamily: "Vazirmatn",
                width: "100%",
              }}
            >
              با هوشیار چه چیزهایی به دست می‌آوری؟
            </Typography>

            <Box
              component="ul"
              sx={{
                listStylePosition: "inside",
                color: "#357a6e",
                fontFamily: "Vazirmatn",
                fontSize: { xs: "0.8rem", md: "0.95rem" },
                lineHeight: 2,
                m: 0,
                p: 0,
                textAlign: "center",
              }}
            >
              <li>برنامه‌ریزی خودکار و کاملاً شخصی‌سازی‌شده</li>
              <li>یادآوری هوشمند بر اساس الگوهای زندگی</li>
              <li>پیشنهاد فعالیت‌های مهم بر اساس انرژی و زمان</li>
              <li>مدیریت عادت‌ها بدون فشار و استرس</li>
            </Box>
          </Grid>

          {/* ستون چپ */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "#1a6964ff",
                fontWeight: 700,
                fontSize: { xs: "1.3rem", md: "1.7rem" },
                mb: 2,
                fontFamily: "Vazirmatn",
                width: "100%",
              }}
            >
              چرا هوشیار متفاوت است؟
            </Typography>

            <Box
              component="ul"
              sx={{
                listStylePosition: "inside",
                color: "#357a6e",
                fontFamily: "Vazirmatn",
                fontSize: { xs: "0.8rem", md: "0.95rem" },
                lineHeight: 2,
                m: 0,
                p: 0,
                textAlign: "center",
              }}
            >
              <li>برنامه‌ریزی دینامیک خودکار، قابل‌انعطاف و ساده</li>
              <li>پیشنهاد لحظه‌ای بر اساس خلق‌وخو و میزان انرژی</li>
              <li>هماهنگی با اهداف کوتاه‌مدت و بلندمدت</li>
              <li>گفت‌وگوی انسانی با AI برای هر تصمیم کوچک یا بزرگ</li>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
