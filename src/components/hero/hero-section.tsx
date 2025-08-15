import React from "react";
import { useAppSelector } from "../../hooks/hook.ts";
import HeroBanner from "./hero-banner.tsx";
import ProfileCard from "./profile-card.tsx";
import {useNavigate} from "react-router-dom"

const HeroSection: React.FC = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const isActuallyLoggedIn = !!user?.email && !!token;
  const navigate = useNavigate();

  return (
    <section className="flex gap-5 p-5 max-[834px]:p-4 max-[834px]:gap-4 max-[834px]:flex-col mt-[40px]">
      <HeroBanner />
      <ProfileCard  isLoggedIn={isActuallyLoggedIn} onLogin={() => navigate("/login")} user={user} />
    </section>
  );
};

export default HeroSection;
