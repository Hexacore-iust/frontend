import React, { useState } from "react";
import logo from "../assets/Logo.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const appTheme = createTheme({
  typography: {
    fontFamily: "Vazirmatn, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "Vazirmatn, sans-serif",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Vazirmatn, sans-serif",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "Vazirmatn, sans-serif",
          textTransform: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          fontFamily: "Vazirmatn, sans-serif",
        },
      },
    },
  },
});

export default function HomeHeader() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const openPrivacy = () => setPrivacyOpen(true);
  const closePrivacy = () => setPrivacyOpen(false);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
      />

      <ThemeProvider theme={appTheme}>
        <CssBaseline />

        <AppBar
          position="relative"
          sx={{
            bgcolor: "#D1FADF",
            boxShadow: "none",
            borderRadius: "12px",
            mt: 2,
            px: 2,
            direction: "rtl",
          }}
        >
          <Toolbar sx={{ minHeight: 56, px: { xs: 1, md: 3 } }}>
            {/* ✅ دکمه‌ها همیشه نمایش داده بشن (حتی موبایل) */}
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Button
                variant="outlined"
                endIcon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={handleLogin}
                sx={{
                  borderColor: "#0ACF83",
                  color: "#0ACF83",
                  px: 4,
                  borderRadius: "10px",
                  "& .MuiButton-endIcon": { mr: 1, ml: 0 },
                  "&:hover": {
                    borderColor: "#08b971",
                    bgcolor: "rgba(10,207,131,0.08)",
                  },
                }}
              >
                ورود
              </Button>

              <Button
                variant="text"
                onClick={openPrivacy}
                sx={{
                  color: "#357a6e",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  px: 1.5,
                  borderRadius: "10px",
                  "&:hover": {
                    color: "#0E8A62",
                    bgcolor: "rgba(10,207,131,0.06)",
                  },
                }}
              >
                حریم خصوصی
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* لوگو + اسم */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", color: "#357a6e" }}>
                هوشیار
              </Typography>

              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{ width: 55, height: 55, objectFit: "contain", borderRadius: "8px" }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Dialog قوانین و حریم خصوصی */}
        <Dialog
          open={privacyOpen}
          onClose={closePrivacy}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "16px",
              direction: "rtl",
            },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", fontWeight: 900, color: "#357a6e" }}>
            قوانین و حریم خصوصی
          </DialogTitle>

          <DialogContent dividers>
            <Typography
              sx={{
                fontSize: 15,
                lineHeight: 2,
                textAlign: "left",
                direction: "ltr",
                color: "#357a6e",
                opacity: 0.95,
              }}
            >
              هوشیار یک دستیار هوش مصنوعی مکالمه‌ای است که به شما امکان می‌دهد از طریق گفتگو،
              برنامه‌ریزی روزانه، مدیریت کارها و پیگیری عادت‌های خود را انجام دهید.
              <br /><br />
              استفاده از این سرویس به معنی پذیرش این قوانین است. لطفاً پیش از استفاده، موارد زیر را مطالعه کنید.
              <br /><br />
              ما تلاش می‌کنیم مکالمات و اطلاعات شما محرمانه باقی بماند و بدون اجازه‌ی شما در اختیار اشخاص ثالث قرار نگیرد،
              مگر در مواردی که طبق قانون یا برای حفظ امنیت سرویس و جلوگیری از سوءاستفاده لازم باشد.
              <br /><br />
              لطفاً از وارد کردن اطلاعات بسیار حساس مانند رمزهای عبور، اطلاعات بانکی، کدهای یکبارمصرف و موارد مشابه در گفتگوها خودداری کنید.
              مسئولیت اطلاعات واردشده و نتایج استفاده از آن بر عهده کاربر است.
              <br /><br />
              پاسخ‌ها و پیشنهادهای ارائه‌شده توسط هوش مصنوعی جنبه راهنما دارد و ممکن است کامل یا بدون خطا نباشد.
              تصمیم‌گیری نهایی و استفاده از خروجی‌ها بر عهده شماست.
              <br /><br />
              برای بهبود کیفیت سرویس و رفع خطاها، ممکن است داده‌های فنی و عملکردی مانند نوع دستگاه، نسخه برنامه،
              و گزارش خطا به‌صورت حداقلی و در حد نیاز جمع‌آوری شود.
              <br /><br />
              هرگونه استفاده غیرمجاز، تلاش برای اختلال در سرویس، سوءاستفاده یا استفاده خلاف قوانین می‌تواند منجر به محدود شدن دسترسی یا توقف سرویس شود.
              <br /><br />
              این قوانین ممکن است در آینده به‌روزرسانی شوند. ادامه استفاده از سرویس پس از تغییرات، به معنی پذیرش نسخه جدید قوانین خواهد بود.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button
              onClick={closePrivacy}
              variant="contained"
              sx={{
                bgcolor: "#0ACF83",
                px: 5,
                borderRadius: "10px",
                "&:hover": { bgcolor: "#08b971" },
              }}
            >
              بستن
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
