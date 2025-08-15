import React from "react";
import HeroSection from "../../components/hero/hero-section";
import { useAuth } from "../../hooks/useAuth";
import CategoryMenu from "../../components/home/CategoryMenu";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection isLoggedIn={isAuthenticated} />
      <CategoryMenu />
    </div>
  );
};

export default React.memo(HomePage);
