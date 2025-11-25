import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link as MuiLink,
  Stack,
  Divider,
} from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
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
                    // ⬅️ چسبیده به ته صفحه
            bottom: 0,
            left: 0,
            width: "100%",
            bgcolor: "#D1FADF",
            color: "#357a6e",
            borderRadius: "12px 12px 0 0",
            boxShadow: "0 -2px 6px rgba(0,0,0,0.06)",
            pt: 4,
            pb: 2,
            zIndex: 1000,
            fontFamily: "Vazirmatn, sans-serif !important",
            mt: { xs: 5, md: 1.5 },
            direction: "ltr",
            textAlign: "right",
          }}
        >
          <Grid
            container
            spacing={4}
            sx={{
              px: { xs: 2, md: 8 },
              justifyContent: "space-between", // ⬅️ ستون چپ و راست فاصله بگیرن
              alignItems: "flex-start",
            }}
          >
            {/* ستون‌های لینک‌ها (سمت چپ) */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontWeight: 600, mb: 1.5  }}>کاوش</Typography>
                  {[
                    "امکانات دستیار صوتی",
                    "برنامه‌ریزی روزانه",
                    "مدیریت کارها",
                    "نمونه سناریوها",
                  ].map((item) => (
                    <MuiLink
                      key={item}
                      href="#"
                      underline="none"
                      sx={{
                        display: "block",
                        color: "#357a6e",
                        mb: 0.8,
                        fontSize: 14,
                        opacity: 0.85,
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {item}
                    </MuiLink>
                  ))}
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontWeight: 600, mb: 1.5 }}>نوآوری</Typography>
                  {[
                    "هوش مصنوعی مکالمه‌ای",
                    "هماهنگی با تقویم",
                    "یادآوری‌های هوشمند",
                    "اتصال به ابزارها",
                  ].map((item) => (
                    <MuiLink
                      key={item}
                      href="#"
                      underline="none"
                      sx={{
                        display: "block",
                        color: "#357a6e",
                        mb: 0.8,
                        fontSize: 14,
                        opacity: 0.85,
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {item}
                    </MuiLink>
                  ))}
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontWeight: 600, mb: 1.5 }}>درباره ما</Typography>
                  {[
                    "درباره هگزاکور",
                    "حریم خصوصی و امنیت",
                    "وبلاگ و اخبار",
                    "مرکز پشتیبانی",
                  ].map((item) => (
                    <MuiLink
                      key={item}
                      href="#"
                      underline="none"
                      sx={{
                        display: "block",
                        color: "#357a6e",
                        mb: 0.8,
                        fontSize: 14,
                        opacity: 0.85,
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {item}
                    </MuiLink>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            {/* هگزاکور + متن (سمت راست) */}
            <Grid
              item
              xs={12} 
              md={4}
              sx={{
                textAlign: { xs: "center", md: "right" },  // ⬅️ در دسکتاپ کاملاً راست
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 2, color: "#357a6e" }}
              >
                هگزاکور
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#357a6e",
                  opacity: 0.9,
                  mb: 2,
                  fontSize: 14,
                  lineHeight: 1.8,
                  maxWidth: 360,
                  ml: { md: "auto" },          // ⬅️ بچسبه به راست
                  mr: { md: 0 },
                }}
              >
                هگزاکور دستیار صوتی هوشمندی است که به شما کمک می‌کند
                برنامه‌های روزانه، جلسات، کارها و عادت‌های خود را فقط با صحبت کردن
                مدیریت کنید. برنامه‌ریزی شخصی تا کار تیمی، همه در یک فضای ساده و
                فارسی‌زبان
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              >
                <Facebook fontSize="small" sx={{ color: "#357a6e" }} />
                <Instagram fontSize="small" sx={{ color: "#357a6e" }} />
                <Twitter fontSize="small" sx={{ color: "#357a6e" }} />
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3, borderColor: "rgba(0,0,0,0.1)" }} />

          <Typography
            sx={{
              textAlign: "center",
              fontSize: 14,
              opacity: 0.85,
              pb: 1.5,
              color: "#357a6e",
            }}
          >
            © ۲۰۲۵ هگزاکور – پلتفرم برنامه‌ریزی با دستیار صوتی. تمامی حقوق محفوظ است 
          </Typography>
        </Box>
      </ThemeProvider>
    </>
  );
}
