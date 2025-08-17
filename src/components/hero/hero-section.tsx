import React from "react";
import HeroBanner from "./hero-banner.tsx";
import ProfileCard from "./profile-card.tsx";

const HeroSection: React.FC = () => {
  return (
    <section className="flex gap-5 p-5 max-[834px]:p-4 max-[834px]:gap-4 max-[834px]:flex-col mt-[40px]">
      <HeroBanner />
      <ProfileCard />
    </section>
  );
};

export default HeroSection;
