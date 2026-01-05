import React from "react";
import { Box, Typography, Link as MuiLink, Divider } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const footerTheme = createTheme({
  typography: { fontFamily: "Vazirmatn, sans-serif" },
});

export default function Footer() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
      />

      <ThemeProvider theme={footerTheme}>
        <Box
          component="footer"
          sx={{
            width: "100%",
            bgcolor: "#D1FADF",
            color: "#357a6e",
            borderRadius: "12px 12px 0 0",
            boxShadow: "0 -2px 6px rgba(0,0,0,0.06)",
            pt: 4,
            pb: 2,
            mt: { xs: 5, md: 1.5 },
            direction: "ltr",
          }}
        >
          {/* محتوای اصلی: راست و چپ دقیق */}
          <Box
            sx={{
              px: { xs: 2, md: 8 },
              display: "flex",
              justifyContent: "space-between", // ⬅️ راست / چپ
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: { xs: 4, md: 6 },
            }}
          >
            {/* سمت راست: هگزاکور + متن */}
            <Box
              sx={{
                width: { xs: "100%", md: 520 },
                textAlign: "right",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  mb: 1.5,
                  fontSize: { xs: 22, md: 26 },
                  direction: "rtl",
                  textAlign: "left",
                }}
              >
                هگزاکور
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 15, md: 16 },
                  lineHeight: 2,
                  opacity: 0.95,
                  textAlign: "left",
                  direction: "rtl"
                }}
              >
                هگزاکور دستیار صوتی هوشمندی است که به شما کمک می‌کند برنامه‌های
                روزانه، جلسات، کارها و عادت‌های خود را فقط با صحبت کردن مدیریت
                کنید. برنامه‌ریزی شخصی تا کار تیمی، همه در یک فضای ساده و
                فارسی‌زبان
              </Typography>
            </Box>

            {/* سمت چپ: ارتباط با ما */}
            <Box
              sx={{
                width: { xs: "100%", md: 260 },
                textAlign: "right",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  mb: 1.5,
                  fontSize: { xs: 18, md: 20 },
                }}
              >
                ارتباط با ما
              </Typography>

              {["درباره هگزاکور", "مرکز پشتیبانی"].map((item) => (
                <MuiLink
                  key={item}
                  href="#"
                  underline="none"
                  sx={{
                    display: "block",
                    color: "#357a6e",
                    fontSize: { xs: 15, md: 16 },
                    mb: 1,
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  {item}
                </MuiLink>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: "rgba(0,0,0,0.1)" }} />

          <Typography
            sx={{
              textAlign: "center",
              fontSize: { xs: 14, md: 15 },
              opacity: 0.85,
              pb: 1.5,
            }}
          >
            © ۲۰۲۵ هگزاکور – پلتفرم برنامه‌ریزی با دستیار صوتی. تمامی حقوق محفوظ است
          </Typography>
        </Box>
      </ThemeProvider>
    </>
  );
}
