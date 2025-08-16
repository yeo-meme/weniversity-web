import React from "react";
import HeroSection from "../../components/hero/hero-section";
import CategoryMenu from "../../components/home/CategoryMenu";
import BoostList from "../../components/home/BoostList";
import VodList from "../../components/home/VodList";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryMenu />
      <BoostList />
      <VodList />
    </div>
  );
};

export default HomePage;
