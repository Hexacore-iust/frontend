import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { tokenStorage } from "../api/axios";
import "../assets/styles/LoginForm.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((s) => !s);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError("");
    setSuccess("");

    if (!value) {
      setEmailError("ایمیل الزامی است");
      return;
    }

    if (!emailRegex.test(value)) {
      setEmailError("ایمیل باید به صورت user@example.com باشد");
      return;
    }

    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setError("");
    setSuccess("");

    if (!value) {
      setPasswordError("رمز عبور الزامی است");
      return;
    }

    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("ایمیل الزامی است");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError("فرمت ایمیل نادرست است");
      hasError = true;
    }

    if (!password) {
      setPasswordError("رمز عبور الزامی است");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://hexacore-iust-backend.liara.run/api/auth/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        }
      );

      let data = {};
      try {
        data = await response.json();
      } catch {
        setError("خطا دوباره تلاش کنید.");
      }

      if (response.ok) {
        setSuccess("ورود با موفقیت انجام شد");
        tokenStorage.setTokens(data.tokens.access, data.tokens.refresh);
        navigate("/homepage");
        return;
      }

      const backendEmail = (Array.isArray(data.email) && data.email[0]) || "";
      const backendPassword =
        (Array.isArray(data.password) && data.password[0]) || "";

      const backendGeneral =
        data.message ||
        data.detail ||
        (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) ||
        "";

      if (backendEmail) setEmailError(backendEmail);
      if (backendPassword) setPasswordError(backendPassword);

      if (!backendEmail && !backendPassword) {
        setError(backendGeneral || "ورود ناموفق بود");
      } else if (backendGeneral) {
        setError(backendGeneral);
      }
    } catch {
      setError("خطای شبکه. دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError("لطفاً ایمیل خود را وارد کنید");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("لطفاً یک ایمیل معتبر وارد کنید");
      return;
    }

    window.location.href = `/otp-verification?email=${encodeURIComponent(
      email
    )}`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-info">
          <div className="login-title">
            <h1>ورود</h1>
            <div className="login-underline" />
          </div>

          {error && (
            <Alert severity="error" sx={{ width: "fit-content", mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ width: "fit-content", mb: 2 }}>
              {success}
            </Alert>
          )}

          <form noValidate onSubmit={handleSubmit} className="login-form">
            <TextField
              required
              label="ایمیل"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={Boolean(emailError)}
              helperText={emailError}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
            />

            <TextField
              required
              label="رمز عبور"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              error={Boolean(passwordError)}
              helperText={passwordError}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div className="login-forgot-password">
              <a
                href="#"
                style={{ textDecoration: "underline", fontSize: "small" }}
                onClick={handleForgotPassword}
              >
                رمز عبور خود را فراموش کرده‌اید؟
              </a>
            </div>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, backgroundColor: "#00c48c" }}
            >
              <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>ورود</span>
              {loading && (
                <CircularProgress
                  size={18}
                  color="inherit"
                  sx={{ mr: 1, marginLeft: "12px" }}
                />
              )}
            </Button>

            <div className="signup-login-link">
              <a href="/signup" style={{ textDecoration: "underline" }}>
                ثبت نام نکرده‌اید؟
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
