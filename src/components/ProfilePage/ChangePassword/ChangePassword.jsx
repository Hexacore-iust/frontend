import React, { useState } from "react";
import { apiInstance } from "../../../api/axios";
import { IconButton, InputAdornment, TextField, Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "./ChangePassword.styles.scss";

const ChangePassword = () => {
  const [errorMessage, setErrorMessage] = useState({
    currentPass: "",
    newPass: "",
    repeatedPass: "",
  });
  const [error, setError] = useState({
    currentPassError: false,
    newPassError: false,
    repeatedPassError: false,
  });

  console.log(errorMessage);
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    apiInstance
      .patch("/api/auth/profile/update/", {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: repeatedPassword,
      })
      .catch((err) => {
        if (err.response.status === 400) {
          if (err.response.data.current_password) {
            setError((prev) => ({
              ...prev,
              currentPassError: true,
            }));
            setErrorMessage((prev) => ({
              ...prev,
              currentPass: err.response.data.current_password[0],
            }));
          }
          if (err.response.data.new_password) {
            setError((prev) => ({
              ...prev,
              newPassError: true,
            }));
            setErrorMessage((prev) => ({
              ...prev,
              newPass: err.response.data.new_password[0],
            }));
          }
          if (err.response.data.confirm_new_password) {
            setError((prev) => ({
              ...prev,
              repeatedPassError: true,
            }));
            setErrorMessage((prev) => ({
              ...prev,
              repeatedPass: err.response.data.confirm_new_password[0],
            }));
          }
        }
      });
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
              error={error.currentPassError}
              helperText={errorMessage.currentPass}
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
              error={error.newPassError}
              helperText={errorMessage.newPass}
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
              error={error.repeatedPassError}
              helperText={errorMessage.repeatedPass}
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
