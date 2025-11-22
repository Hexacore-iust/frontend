import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import OTPVerification from './components/OTPPage';
// import Home from "./pages/Home";
import Profile from "./components/ProfilePage/ProfilePage";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/otp-verification" element={<OTPVerification email="user@example.com" />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
