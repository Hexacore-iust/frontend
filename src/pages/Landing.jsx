import React from "react";
import { useNavigate, useEffect } from "react-router-dom";
import HomeHeader from "../components/HeaderLanding";
import HeroSection from "../components/landing/landing1";
import WhySection from "../components/landing/landing2";
import TeamSection from "../components/landing/landing3";
import Footer from "../components/Footer";
import { tokenStorage } from "../api/axios";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const initData = tg?.initData;

    if (initData) {
      navigate("/telegram-auth", { replace: true });
      return;
    }
    const existingAccess = tokenStorage.getAccess();
    if (existingAccess) {
      navigate("/homepage", { replace: true });
    }
  }, [navigate]);
  return (
    <>
      <HomeHeader />
      <HeroSection />
      <WhySection />
      <TeamSection />
      <Footer />
    </>
  );
};

export default Landing;
