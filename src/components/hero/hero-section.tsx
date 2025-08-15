import React from "react";
import { useAppSelector } from "../../hooks/redux-hooks";
import HeroBanner from "./hero-banner.tsx";
import ProfileCard from "./profile-card.tsx";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  return (
    <section className="flex gap-5 p-5 max-[834px]:p-4 max-[834px]:gap-4 max-[834px]:flex-col mt-[40px]">
      <HeroBanner />
      <ProfileCard isLoggedIn={isAuthenticated} user={user} />
    </section>
  );
};

export default HeroSection;
