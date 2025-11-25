import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/header';
import Footer from './components/Footer';
import HomeHeader from './components/headerhome';
import HeroSection from "./components/landing/landing1";
import WhySection from "./components/landing/landing2";
import TeamSection from "./components/landing/landing3";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HomeHeader />
    <HeroSection />
    <WhySection />
    <TeamSection />
    <Footer />
  </React.StrictMode>
);


