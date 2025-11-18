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

  // فقط برای تست؛ بعداً URL واقعی API را بگذار
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
          </div>
  );
};

export default Profile;
