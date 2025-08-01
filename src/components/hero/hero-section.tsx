import React, { useState } from "react";
import HeroBanner from "./hero-banner.tsx";
import ProfileCard from "./profile-card.tsx";

const HeroSection: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <section className="flex gap-5 p-5 max-[834px]:p-4 max-[834px]:gap-4 max-[834px]:flex-col mt-[40px]">
      <HeroBanner />
      <ProfileCard isLoggedIn={isLoggedIn} onLogin={handleLogin} />
    </section>
  );
};

export default HeroSection;
