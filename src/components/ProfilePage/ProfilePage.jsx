import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import axios from "axios";
import "./ProfilePage.scss";

const Profile = ({ onphotochange }) => {
  const [formData, setFormData] = useState({
    profilePicture: "",
    name: "",
    username: "",
    email: "",
    gender: "",
    birthDate: "",
    city: "",
    password: "",
    currentPassword: "",
  });

  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const getFormData = async () => {
    try {
      const response = await axios.get("", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setFormData((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture || "",
        name: response.data.name || "",
        username: response.data.username || "",
        email: response.data.email || "",
        gender: response.data.gender || "",
        city: response.data.city || "",
        birthDate: response.data.birthDate || "",
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const putDataForm = async () => {
    const formDataImage = new FormData();

    if (image) {
      formDataImage.append("profilePicture", image);
    }

    formDataImage.append("username", formData.username);
    formDataImage.append("email", formData.email);
    formDataImage.append("name", formData.name);
    formDataImage.append("gender", formData.gender);
    formDataImage.append("birthDate", formData.birthDate);
    formDataImage.append("city", formData.city);

    if (formData.password) {
      formDataImage.append("password", formData.password);
    }
    if (formData.currentPassword) {
      formDataImage.append("currentPassword", formData.currentPassword);
    }

    try {
      const response = await axios.put("", formDataImage, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201 || response.status === 202) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        console.log(response);
        if (onphotochange) onphotochange();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const validateEmail = (email) => {
    if (!email) return "ایمیل الزامی است";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email))
      return "ایمیل معتبر نیست (مثال: email@example.com)";
    return "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setFormData((prev) => ({
        ...prev,
        profilePicture: URL.createObjectURL(file),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailError(validateEmail(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailError) return;
    putDataForm();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    getFormData();
  };

  const handleBack = () => {
    const previousRoute = location.state?.from || "/";
    navigate(previousRoute);
  };

  const togglePasswordVisibility = () => setShowPassword((p) => !p);
  const togglePasswordVisibility2 = () => setShowPassword2((p) => !p);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-card__inner">
          {/* <button className="profile-card__back-btn" onClick={handleBack}>
            برگشت
          </button> */}

          {/* آواتار و دکمه آپلود */}
          <div className="profile-card__avatar-section">
            <div className="profile-card__avatar-circle">
              {formData.profilePicture && (
                <img src={formData.profilePicture} alt="profile" />
              )}
            </div>
            <label className="profile-card__avatar-btn">
              اضافه کردن عکس
              <input
                type="file"
                className="profile-card__file-input"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* فرم اصلی */}
          <form className="profile-card__form" onSubmit={handleSubmit}>
            {/* ردیف ۱: نام کاربری + ایمیل */}
            <div className="profile-card__row">
              <div className="profile-card__field">
                <label>نام کاربری</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="نام کاربری"
                />
              </div>
              <div className="profile-card__field">
                <label>ایمیل</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                />
                {emailError && (
                  <span className="profile-card__error">{emailError}</span>
                )}
              </div>
            </div>

            {/* ردیف ۲: نام + شهر */}
            <div className="profile-card__row">
              <div className="profile-card__field">
                <label>نام</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="profile-card__field">
                <label>شهر</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ردیف ۳: جنسیت + تاریخ تولد */}
            <div className="profile-card__row">
              <div className="profile-card__field">
                <label>جنسیت</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="Male">مرد</option>
                  <option value="Female">زن</option>
                  <option value="Other">سایر</option>
                </select>
              </div>
              <div className="profile-card__field">
                <label>تاریخ تولد</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ردیف ۴: رمز فعلی + رمز جدید (مثل دو فیلد پایین فیگما) */}
            <div className="profile-card__row">
              <div className="profile-card__field profile-card__field--password">
                <label>رمز عبور فعلی</label>
                <div className="profile-card__password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="profile-card__eye-btn"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>

              <div className="profile-card__field profile-card__field--password">
                <label>رمز عبور جدید</label>
                <div className="profile-card__password-wrapper">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="profile-card__eye-btn"
                    onClick={togglePasswordVisibility2}
                  >
                    {showPassword2 ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
            </div>

            {/* متن راهنما پایین فرم*/}
            <p className="profile-card__description">
              به دستیار هوشمند کمک کن! با بارگذاری و تکمیل اطلاعات شخصی خود، به
              مدل هوش مصنوعی ما کمک می‌کنید تا تحلیل‌ها و پیشنهادهای ارائه‌شده
              را بر اساس ویژگی‌ها، نیازها و اهداف فردی شما به‌صورت دقیق‌تر و
              شخصی‌سازی‌شده تنظیم کند. تمامی داده‌های واردشده صرفاً برای بهبود
              کیفیت تجربه کاربری استفاده می‌شوند و مطابق با اصول محرمانگی و حریم
              خصوصی نگهداری خواهند شد.
            </p>

            {/* دکمه‌ها */}
            <div className="profile-card__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={handleCancel}
              >
                انصراف
              </button>
              <button type="submit" className="btn btn--primary">
                ثبت
              </button>
            </div>

            {success && (
              <div className="profile-card__success">
                اطلاعات پروفایل با موفقیت ذخیره شد.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
