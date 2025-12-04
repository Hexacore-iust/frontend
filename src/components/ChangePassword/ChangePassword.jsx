import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./ChangePassword.styles.scss";

const ChangePassword = () => {
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    repeatedPassword: "",
  });

  const { currentPassword, newPassword, repeatedPassword } = password;

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleShowPasswordBox = () => {
    setShowPasswordBox((showPasswordBox) => !showPasswordBox);
  };

  const handlePasswordValidation = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      console.log(":(");
      setPasswordError(
        "پسورد باید حداقل هشت رقم و شامل حروف بزرگ و اعداد باشد"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
    handlePasswordValidation(value);
  };
  console.log("p", passwordError);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      handlePasswordValidation(newPassword) &&
      newPassword === repeatedPassword
    ) {
      console.log("Form submitted successfully!");
    } else {
      console.log("Password validation failed");
    }
  };

  return (
    <>
      <h5 className="profile-card__header">
        تغییر رمز عبور
        {showPasswordBox ? (
          <ExpandMoreIcon onClick={handleShowPasswordBox} />
        ) : (
          <ExpandLessIcon onClick={handleShowPasswordBox} />
        )}
      </h5>
      {!showPasswordBox && (
        <form onSubmit={handleSubmit}>
          <div className="profile-card__container-password">
            <TextField
              name="currentPassword"
              label="رمز عبور"
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="newPassword"
              label="رمزعبور جدید"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="repeatedPassword"
              label="تکرار رمزعبور"
              type={showPassword ? "text" : "password"}
              value={repeatedPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="password-btn">
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "#00c48c",
              }}
            >
              تغییر رمزعبور
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default ChangePassword;
