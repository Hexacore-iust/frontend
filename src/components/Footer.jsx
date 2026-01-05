import React from "react";
import { Box, Typography, Link as MuiLink, Divider, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const footerTheme = createTheme({
  typography: { fontFamily: "Vazirmatn, sans-serif" },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { fontFamily: "Vazirmatn, sans-serif" },
      },
    },
  },
});

export default function Footer() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
      />

      <ThemeProvider theme={footerTheme}>
        <CssBaseline />

        <Box
          component="footer"
          sx={{
            width: "100%",
            bgcolor: "#D1FADF",
            color: "#357a6e",
            borderRadius: "12px 12px 0 0",
            boxShadow: "0 -2px 6px rgba(0,0,0,0.06)",
            mt: { xs: 4, sm: 4, md: 1.5 },
            pt: { xs: 3, sm: 3.5, md: 4 },   // ✅ ریسپانسیو
            pb: { xs: 2, sm: 2.5, md: 2 },   // ✅ ریسپانسیو
            direction: "ltr",                // ✅ جهت کلی دست نخورده
          }}
        >
          {/* محتوای اصلی */}
          <Box
            sx={{
              px: { xs: 2, sm: 3, md: 8 },   // ✅ ریسپانسیو
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: { xs: 2, sm: 3, md: 6 },  // ✅ ریسپانسیو
              flexWrap: { xs: "wrap", sm: "nowrap" }, // ✅ موبایل wrap، بقیه نه
            }}
          >
            {/* سمت راست: هوشیار + متن */}
            <Box
              sx={{
                width: { xs: "100%", sm: "62%", md: 520 }, // ✅ روی sm کنار هم می‌مونن
                textAlign: "right",
                direction: "rtl",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  mb: { xs: 1, md: 1.5 },
                  // ✅ فونت با کوچک شدن صفحه خودکار کم میشه
                  fontSize: "clamp(16px, 2.2vw, 26px)",
                  textAlign: "left",
                  direction: "ltr",
                }}
              >
                هوشیار
              </Typography>

              <Typography
                sx={{
                  // ✅ فونت متن پاراگراف هم خودکار کم میشه
                  fontSize: "clamp(12px, 1.35vw, 16px)",
                  lineHeight: { xs: 1.9, md: 2 },
                  opacity: 0.95,
                  textAlign: "left",
                  direction: "ltr",
                }}
              >
                هوشیار دستیار صوتی هوشمندی است که به شما کمک می‌کند برنامه‌های
                روزانه، جلسات، کارها و عادت‌های خود را فقط با صحبت کردن مدیریت
                کنید. برنامه‌ریزی شخصی تا کار تیمی، همه در یک فضای ساده و
                فارسی‌زبان
              </Typography>
            </Box>

            {/* سمت چپ: ارتباط با ما */}
            <Box
              sx={{
                width: { xs: "100%", sm: "34%", md: 260 },
                textAlign: "right",
                direction: "rtl",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  mb: { xs: 1, md: 1.5 },
                  fontSize: "clamp(14px, 1.6vw, 20px)", // ✅ ریسپانسیو
                  textAlign: "center"
                }}
              >
                ارتباط با ما
              </Typography>

              {["درباره", "مرکز پشتیبانی"].map((item) => (
                <MuiLink
                  key={item}
                  href="#"
                  underline="none"
                  sx={{
                    display: "block",
                    color: "#357a6e",
                    fontSize: "clamp(12px, 1.25vw, 16px)", // ✅ ریسپانسیو
                    mb: { xs: 0.8, md: 1 },
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                    direction: "rtl",
                    textAlign: "center",
                  }}
                >
                  {item}
                </MuiLink>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: "rgba(0,0,0,0.1)" }} />

          <Typography
            sx={{
              textAlign: "center",
              fontSize: "clamp(11px, 1.15vw, 15px)", // ✅ ریسپانسیو
              opacity: 0.85,
              pb: { xs: 1, md: 1.5 },
              direction: "rtl",
            }}
          >
            © ۲۰۲۵ هگزاکور – پلتفرم برنامه‌ریزی با دستیار صوتی. تمامی حقوق محفوظ است
          </Typography>
        </Box>
      </ThemeProvider>
    </>
  );
}
