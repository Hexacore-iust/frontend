import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CustomDatePicker from "../DatePicker/datePicker";
import axios from "axios";
import { baseUrl } from "../../config";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "./ProfilePage2.scss";

const Profile2 = () => {
  const [date, setDate] = React.useState(dayjs(Date()));
  const [formData, setFormData] = useState({
    profilePicture: "",
    username: "",
    email: "",
    phoneNumber: "",
    gender: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    city: "",
    job: "",
  });

  const {
    profilePicture,
    username,
    email,
    phoneNumber,
    gender,
    firstName,
    lastName,
    birthDate,
    city,
    job,
  } = formData;

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    repeatedPassword: "",
  });

  const { currentPassword, newPassword, repeatedPassword } = password;

  const [files, setFiles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState(true);

  const token = localStorage.getItem("token");

  const getProfile = () => {
    axios({
      method: "get",
      headers: { Authorization: `Bearer ${token}` },
      url: `${baseUrl}/api/auth/profile/`,
      responseType: "application/json",
    }).then(function (response) {
      const {
        email,
        username,
        first_name,
        last_name,
        phone_number,
        avatar,
        age,
        gender,
      } = response.data;
      setFormData({
        email: email,
        username: username,
        firstName: first_name,
        lastName: last_name,
        phoneNumber: phone_number,
        profilePicture: avatar,
        age: age,
        gender: gender,
      });
    });
  };

  const setProfile = () => {
    axios.patch(`${baseUrl}/api/auth/profile/update/`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    //getProfile();
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleShowPasswordBox = () => {
    setShowPasswordBox((showPasswordBox) => !showPasswordBox);
    console.log("password", showPasswordBox);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    console.log("Password submitted", formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  const handleCancel = () => {
    console.log("cancel");
    setFormData({
      email: email,
      username: username,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      profilePicture: "",
      age: "",
      gender: "",
      birthDate: "",
      city: "",
      job: "",
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-card__inner">
          {/* User Avatar Section */}
          <div className="profile-card__avatar-section">
            <div className="profile-card__avatar-circle">
              {formData.profilePicture && (
                <img src={formData.profilePicture} alt="profile" />
              )}
              <div className="profile-card__avatar-btn">
                <span className="change-button">
                  <input className="profile-card__file-input" type="file" />+
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form className="profile-card__form" onSubmit={handleSubmit}>
            {/* Username, Email, Phone Number */}
            <label className="profile-card__header">اطلاعات حساب کاربری</label>
            <div className="profile-card__container">
              <TextField
                required
                // disabled
                // id="email"
                name="email"
                label="ایمیل"
                value={email}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
                sx={{ input: { color: "#777" } }}
              />
              <TextField
                required
                name="username"
                label="نام کاربری"
                value={username}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
                sx={{ input: { color: "#777" } }}
              />
              <TextField
                name="phoneNumber"
                label="تلفن همراه"
                value={phoneNumber}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
                sx={{ input: { color: "#777" } }}
              />
            </div>

            {/* Personal Information */}
            <label className="profile-card__header">اطلاعات شخصی</label>
            <div className="profile-card__container">
              <TextField
                name="firstName"
                label="نام"
                value={firstName}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
                sx={{ input: { color: "#777" } }}
              />
              <TextField
                name="lastName"
                label="نام خانوادگی"
                value={lastName}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
                sx={{ input: { color: "#777" } }}
              />
              <TextField
                name="gender"
                label="جنسیت"
                value={gender}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
                sx={{ input: { color: "#777" } }}
              />

              <TextField
                name="city"
                label="شهر محل زندگی"
                value={city}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
                sx={{ input: { color: "#777" } }}
              />
              <TextField
                name="job"
                label="شغل"
                value={job}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
                sx={{ input: { color: "#777" } }}
              />
              <CustomDatePicker
                dateValue={date}
                setDateValue={setDate}
                label={"تاریخ تولد"}
              />
            </div>

            {/* Password Fields */}
            <label className="profile-card__header">
              تغییر رمز عبور
              {showPasswordBox ? (
                <ExpandMoreIcon onClick={handleShowPasswordBox} />
              ) : (
                <ExpandLessIcon onClick={handleShowPasswordBox} />
              )}
            </label>
            {showPasswordBox ? (
              <></>
            ) : (
              <div className="profile-card__container-password">
                <TextField
                  name="currentPassword"
                  label="رمز عبور"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => handlePasswordChange(e)}
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
                  onChange={(e) => handlePasswordChange(e)}
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
                  onChange={(e) => handlePasswordChange(e)}
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

                <Button
                  type="cancel"
                  variant="contained"
                  style={{
                    backgroundColor: "#ff9d00",
                    width: "90px",
                    marginTop: "1rem",
                  }}
                >
                  تغییر پسورد
                </Button>
              </div>
            )}

            {/* File Upload Section */}
            <div className="file-upload">
              <label className="profile-card__header">
                {" "}
                به دستیار هوشمند کمک کن!
              </label>
              <p>
                با بارگذاری و تکمیل اطلاعات شخصی خود، به مدل هوش مصنوعی ما کمک
                می‌کنید تا تحلیل‌ها و پیشنهادهای ارائه‌شده را بر اساس ویژگی‌ها،
                نیازها و اهداف فردی شما به‌صورت دقیق‌تر و شخصی‌سازی‌شده تنظیم
                کند. تمامی داده‌های واردشده صرفاً برای بهبود کیفیت تجربه کاربری
                استفاده می‌شوند و مطابق با اصول محرمانگی و حریم خصوصی نگهداری
                خواهند شد.
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-upload-input"
              />
              {/* Display selected file names */}
              <div>
                {files.length > 0 && (
                  <ul>
                    {Array.from(files).map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <label htmlFor="file-upload-input">
                <Button
                  variant="contained"
                  component="span"
                  style={{ backgroundColor: "#00c48c", width: "90px" }}
                >
                  اپلود فایل
                </Button>
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-submit">
              <Button
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: "#00c48c",
                  width: "auto",
                  marginTop: "1rem",
                }}
              >
                ثبت اطلاعات
              </Button>
              <Button
                variant="contained"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ff9d00",
                  width: "auto",
                  marginTop: "1rem",
                }}
              >
                حذف تغییرات
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile2;
