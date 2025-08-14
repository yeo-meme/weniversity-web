import React from "react";
import { useAppSelector } from "../../hooks/redux-hooks";
import HeroBanner from "./hero-banner.tsx";
import ProfileCard from "./profile-card.tsx";

interface HeroSectionProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLogin }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <section className="flex gap-5 p-5 max-[834px]:p-4 max-[834px]:gap-4 max-[834px]:flex-col mt-[40px]">
      <HeroBanner />
      <ProfileCard isLoggedIn={isAuthenticated} onLogin={onLogin} user={user} />
    </section>
  );
};

export default HeroSection;
