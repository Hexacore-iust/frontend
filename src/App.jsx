import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import OTPVerification from "./components/OTPPage";
import HomePage from "./components/HomePage/HomePage";
import TelegramAuth from "./pages/TelegramAuth";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/telegram-auth" element={<TelegramAuth />} />
          <Route
            path="/otp-verification"
            element={<OTPVerification email="user@example.com" />}
          />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/homepage" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
