import React from "react";

import HomeHeader from "../components/HeaderLanding";
import HeroSection from "../components/landing/landing1";
import WhySection from "../components/landing/landing2";
import TeamSection from "../components/landing/landing3";
import Footer from "../components/Footer";

const Landing = () => {
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