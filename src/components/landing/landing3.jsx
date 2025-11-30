import React from "react";
import { Box, Typography, Stack } from "@mui/material";

export default function TeamSection() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#E2F3EF",       // پس‌زمینه دقیقا مثل سکشن‌های دیگر
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        direction: "rtl",
        py: { xs: 10, md: 12 },   // ارتفاع بیشتر
        mt: { xs: 5, md: 1.5 },     // فاصله از سکشن قبلی
        direction: "ltr",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",     // دقیقا هم‌عرض بقیه
          px: { xs: 2, md: 4 },
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.4rem", md: "2rem" },
              color: "#1a6964ff",
              fontFamily: "Vazirmatn",
            }}
          >
            تیمی کوچک با رؤیاهای بزرگ
          </Typography>

          <Typography
            sx={{
              color: "#357A6E",
              fontFamily: "Vazirmatn",
              fontSize: { xs: "0.9rem", md: "1.05rem" },
              lineHeight: 2.2,
              maxWidth: 900,
            }}
          >
            <span style={{ color: "#faa124ff" }}>هوشیار</span> توسط یک تیم هفت نفره دانشجویی ساخته شده؛
            گروهی که با اشتیاق، تخصص و ساعت‌ها تلاش بی‌وقفه کنار هم ایستاده‌اند.
            ما از دل دانشگاه‌ها آمده‌ایم، اما نگاهمان به آینده است—آینده‌ای که
            در آن برنامه‌ریزی هوشمندتر، انسانی‌تر و در دسترس‌تر باشد.
            مأموریت ما ساختن ابزاری است که واقعاً زندگی را ساده‌تر کند.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
