import React from "react";
import HeroSection from "../../components/hero/hero-section";
import { useAuth } from "../../hooks/useAuth";
import CategoryMenu from "../../components/home/CategoryMenu";
import BoostList from "../../components/home/BoostList";
import VodList from "../../components/home/VodList";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <HeroSection isLoggedIn={isAuthenticated} />
      <CategoryMenu />
      <BoostList />
      <VodList />
    </div>
  );
};

export default React.memo(HomePage);
