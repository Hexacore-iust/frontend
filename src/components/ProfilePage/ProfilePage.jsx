import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Button, ButtonBase, Avatar } from "@mui/material";
import CustomDatePicker from "../DatePicker/DatePicker";
import { baseUrl } from "../../config";
import ChangePassword from "./ChangePassword/ChangePassword";
import FileUpload from "./FileUpload..jsx";
import "./ProfilePage.styles.scss";
import { apiInstance } from "../../api/axios.js";

const Profile = () => {
  const [date, setDate] = useState();
  const [emailError, setEmailError] = useState("");
  const [image, setImage] = useState(null);
  const genderOptions = [
    { value: "F", label: "زن" },
    { value: "M", label: "مرد" },
    { value: "O", label: "دیگر" },
  ];

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

  const handleChangeDate = (value) => {
    setDate((prev) => ({
      ...prev,
      start: value,
    }));
    setFormData((prev) => ({
      ...prev,
      birthDate: value,
    }));
  };

  const getProfile = () => {
    apiInstance.get("/api/auth/profile/").then((response) => {
      if (response) {
        const {
          email,
          username,
          first_name,
          last_name,
          phone_number,
          avatar,
          date_of_birth,
          gender,
          job_title,
          city_of_residence,
        } = response.data;

        const fullAvatarUrl = avatar ? `${baseUrl}${avatar}` : null;
        const formattedDate = date_of_birth ? new Date(date_of_birth) : null;

        setFormData({
          email: email,
          username: username,
          firstName: first_name,
          lastName: last_name,
          phoneNumber: phone_number,
          profilePicture: fullAvatarUrl,
          birthDate: formattedDate,
          gender: gender,
          job: job_title,
          city: city_of_residence,
        });
        setDate(date_of_birth);
      }
    });
  };

  const toUtcMidnightISOString = (value) => {
    if (!value) return null;

    const d = value instanceof Date ? value : new Date(value);
    const utcDate = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );
    const year = utcDate.getUTCFullYear();
    const month = (utcDate.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const day = utcDate.getUTCDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const handleFormUpdate = () => {
    const formDataToSend = new FormData();

    const appendIfNotEmpty = (key, value) => {
      if (value != null && value !== "") {
        formDataToSend.append(key, value);
      }
    };

    if (image) {
      formDataToSend.append("avatar", image);
    }
    appendIfNotEmpty("first_name", formData.firstName);

    appendIfNotEmpty("last_name", formData.lastName);
    appendIfNotEmpty("email", formData.email);
    appendIfNotEmpty("phone_number", formData.phoneNumber);
    appendIfNotEmpty("gender", formData.gender);
    appendIfNotEmpty("city_of_residence", formData.city);
    appendIfNotEmpty("job_title", formData.job);
    appendIfNotEmpty(
      "date_of_birth",
      toUtcMidnightISOString(formData.birthDate)
    );

    apiInstance
      .patch("/api/auth/profile/update/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormUpdate();
    console.log("Form submitted", formData);
  };

  const handleCancel = () => {
    console.log("cancel");
    setFormData({
      email: formData.email,
      username: formData.username,
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div>
            <ButtonBase
              component="label"
              tabIndex={-1}
              aria-label="Avatar image"
              sx={{
                borderRadius: "40px",
                width: "150px",
                "&:has(:focus-visible)": {
                  outline: "2px solid",
                  outlineOffset: "2px",
                },
              }}
            >
              <Avatar
                alt="Upload new avatar"
                src={formData.profilePicture || "../../assets/pics/profile.jpg"}
                sx={{ width: "150px", height: "150px" }}
              />
              <input
                type="file"
                accept="image/*"
                style={{
                  border: 0,
                  clip: "rect(0 0 0 0)",
                  height: "1px",
                  margin: "-1px",
                  overflow: "hidden",
                  padding: 0,
                  position: "absolute",
                  whiteSpace: "nowrap",
                  width: "1px",
                }}
                onChange={handleProfilePictureChange}
              />
            </ButtonBase>
          </div>
        </div>

        {/* Profile Form */}
        <form className="profile-card__form" onSubmit={handleSubmit}>
          {/* Username, Email, Phone Number */}
          <h5 className="profile-card__header">اطلاعات حساب کاربری</h5>
          <div className="profile-card__container">
            <TextField
              required
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
              select
              name="gender"
              label="جنسیت"
              value={formData.gender}
              onChange={(e) => handleChange(e)}
              fullWidth
              margin="normal"
              size="small"
              sx={{ input: { color: "#777" } }}
            >
              {genderOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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
              dateValue={formData.birthDate}
              handleChangeDate={handleChangeDate}
              label={"تاریخ تولد"}
              fullWidth={true}
            />
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

        {/* File Upload Section */}
        <FileUpload />

        {/* Password Fields */}
        <ChangePassword />
      </div>
    </div>
  );
};

export default Profile;
