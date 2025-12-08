import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CustomDatePicker from "../DatePicker/DatePicker";
import axios from "axios";
import { baseUrl } from "../../config";
import ChangePassword from "../ChangePassword/ChangePassword";
import "./ProfilePage.styles.scss";

const Profile = () => {
  const [date, setDate] = useState();
  const [image, setImage] = useState(null);
  const [emailError, setEmailError] = useState("");

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

  const [files, setFiles] = useState([]);

  const token = JSON.parse(localStorage.getItem("token"));

  const handleChangeDate = (value) => {
    setDate((prev) => ({
      ...prev,
      start: value,
    }));
  };

  const getProfile = () => {
    axios({
      method: "get",
      headers: { Authorization: `Bearer ${token}` },
      url: `${baseUrl}/api/auth/profile/`,
    }).then(function (response) {
      console.log("res", response);
      const {
        email,
        username,
        first_name,
        last_name,
        phone_number,
        avatar,
        age,
        gender,
        job_title,
        city_of_residence,
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
        job: job_title,
        city: city_of_residence,
      });
    });
  };

  console.log(formData);

  const handleFormUpdate = async () => {
    const formDataToSend = new FormData();
    if (image) {
      formDataToSend.append("profilePicture", image);
    }
    formDataToSend.append("first_name", formData.firstName);
    formDataToSend.append("last_name", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone_number", formData.phoneNumber);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("city_of_residence", formData.city);
    formDataToSend.append("job_title", formData.job);

    try {
      const response = await axios.patch(
        `${baseUrl}/api/profile/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile updated successfully", response.data);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  const handleEmailValidation = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("ایمیل باید به فرمت user@example.com باشد!");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name === "email") {
      handleEmailValidation(value);
      console.log(emailError);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setFormData({ ...formData, profilePicture: URL.createObjectURL(file) });
    }
  };

  const handleFileChange = (e) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormUpdate();
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
    <div className="profile-card">
      <div className="profile-card__inner">
        {/* User Avatar Section */}
        <div className="profile-card__avatar-section">
          <div className="profile-card__avatar-circle">
            {formData.profilePicture && (
              <img
                src={formData.profilePicture || "../../assets/pics/profile.jpg"}
                alt="profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
          <div className="profile-card__avatar-btn">
            <span className="change-button">
              <input
                className="profile-card__file-input"
                type="file"
                onChange={handleProfilePictureChange}
              />
              +
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <form className="profile-card__form" onSubmit={handleSubmit}>
          {/* Username, Email, Phone Number */}
          <h5 className="profile-card__header">اطلاعات حساب کاربری</h5>
          <div className="profile-card__container">
            <TextField
              required
              // disabled
              // id="email"
              name="email"
              label="ایمیل"
              value={formData.email}
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
              value={formData.username}
              onChange={(e) => handleChange(e)}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
            />
            <TextField
              name="phoneNumber"
              label="تلفن همراه"
              value={formData.phoneNumber}
              onChange={(e) => handleChange(e)}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
            />
          </div>

          {/* Personal Information */}
          <h5 className="profile-card__header">اطلاعات شخصی</h5>
          <div className="profile-card__container">
            <TextField
              name="firstName"
              label="نام"
              value={formData.firstName}
              onChange={(e) => handleChange(e)}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
            />
            <TextField
              name="lastName"
              label="نام خانوادگی"
              value={formData.lastName}
              onChange={(e) => handleChange(e)}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
            />
            <TextField
              name="gender"
              label="جنسیت"
              value={formData.gender}
              onChange={(e) => handleChange(e)}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
            />

            <TextField
              name="city"
              label="شهر محل زندگی"
              value={formData.city}
              onChange={(e) => handleChange(e)}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
            />
            <TextField
              name="job"
              label="شغل"
              value={formData.job}
              onChange={(e) => handleChange(e)}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
            />
            <CustomDatePicker
              dateValue={date}
              handleChangeDate={handleChangeDate}
              label={"تاریخ تولد"}
              fullWidth={true}
            />
          </div>
          {/* File Upload Section */}
          <div className="file-upload">
            <h5 className="profile-card__header"> به دستیار هوشمند کمک کن!</h5>
            <p>
              با بارگذاری و تکمیل اطلاعات شخصی خود، به مدل هوش مصنوعی ما کمک
              می‌کنید تا تحلیل‌ها و پیشنهادهای ارائه‌شده را بر اساس ویژگی‌ها،
              نیازها و اهداف فردی شما به‌صورت دقیق‌تر و شخصی‌سازی‌شده تنظیم کند.
              تمامی داده‌های واردشده صرفاً برای بهبود کیفیت تجربه کاربری استفاده
              می‌شوند و مطابق با اصول محرمانگی و حریم خصوصی نگهداری خواهند شد.
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
                style={{ backgroundColor: "#00c48c" }}
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
              }}
            >
              ثبت اطلاعات
            </Button>
            <Button
              variant="contained"
              onClick={handleCancel}
              style={{
                backgroundColor: "#ff9d00",
              }}
            >
              حذف تغییرات
            </Button>
          </div>
        </form>
        {/* Password Fields */}
        <ChangePassword />
      </div>
    </div>
  );
};

export default Profile;
