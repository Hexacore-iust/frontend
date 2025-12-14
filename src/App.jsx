import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import OTPVerification from "./components/OTPPage";
import Chat from "./pages/Chat";
import HomePage from "./components/HomePage/HomePage";
import Dashboard from "./components/Dashboard/Dashboard";
import TaskManagementPage from "./components/TaskManagement/TaskManagement2";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
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
