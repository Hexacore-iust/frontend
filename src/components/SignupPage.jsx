import React, { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../assets/styles/SignupForm.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // field-level errors (like login)
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const clearTopMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleUsernameChange = (e) => {
    const v = e.target.value;
    setUsername(v);
    clearTopMessages();
    if (!v) return setUsernameError("نام کاربری الزامی است");
    setUsernameError("");
  };

  const handleEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    clearTopMessages();

    if (!v) return setEmailError("ایمیل الزامی است");
    if (!emailRegex.test(v)) return setEmailError("ایمیل باید معتبر باشد");
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    const v = e.target.value;
    setPassword(v);
    clearTopMessages();

    if (!v) return setPasswordError("رمز عبور الزامی است");
    if (!passwordRegex.test(v))
      return setPasswordError(
        "رمز عبور حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک و عدد باشد"
      );
    setPasswordError("");

    if (confirmPassword && v !== confirmPassword) {
      setConfirmPasswordError("رمزها یکسان نیستند");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const v = e.target.value;
    setConfirmPassword(v);
    clearTopMessages();

    if (!v) return setConfirmPasswordError("تایید رمز عبور الزامی است");
    if (password && v !== password)
      return setConfirmPasswordError("رمزها یکسان نیستند");
    setConfirmPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearTopMessages();
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!username) {
      setUsernameError("نام کاربری الزامی است");
      hasError = true;
    }

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
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "رمز عبور حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک و عدد باشد"
      );
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("تایید رمز عبور الزامی است");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("رمزها یکسان نیستند");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://hexacore-iust-backend.liara.run/api/auth/signup/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password: password,
            password2: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("ثبت نام با موفقیت انجام شد! در حال انتقال به صفحه ورود...");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRememberMe(false);

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        // backend errors
        const backendGeneral = data.message || data.detail || "";
        const backendUsername =
          (Array.isArray(data.username) && data.username[0]) || "";
        const backendEmail = (Array.isArray(data.email) && data.email[0]) || "";
        const backendPassword =
          (Array.isArray(data.password) && data.password[0]) || "";

        if (backendUsername) setUsernameError(backendUsername);
        if (backendEmail) setEmailError(backendEmail);
        if (backendPassword) setPasswordError(backendPassword);

        if (!backendUsername && !backendEmail && !backendPassword) {
          setError(backendGeneral || "ثبت نام ناموفق بود. دوباره تلاش کنید.");
        } else if (backendGeneral) {
          setError(backendGeneral);
        }
      }
    } catch {
      setError("خطای شبکه. لطفاً اتصال اینترنت را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-content">
          <div className="signup-title">
            <h1>ثبت نام</h1>
            <div className="signup-underline" />
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

          <form onSubmit={handleSubmit} className="signup-form" noValidate>
            <TextField
              required
              label="نام کاربری"
              value={username}
              onChange={handleUsernameChange}
              error={Boolean(usernameError)}
              helperText={usernameError}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
            />

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
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              label="تایید رمز عبور"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={Boolean(confirmPasswordError)}
              helperText={confirmPasswordError}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="مرا به خاطر بسپار"
              sx={{ mt: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, backgroundColor: "#00c48c" }}
            >
              <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                {"ثبت نام"}
              </span>
              {loading && (
                <CircularProgress
                  size={18}
                  color="inherit"
                  sx={{ mr: 1, marginLeft: "12px" }}
                />
              )}
            </Button>

            <div className="signup-login-link">
              <a href="/login" style={{ textDecoration: "underline" }}>
                حساب کاربری دارید؟
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
