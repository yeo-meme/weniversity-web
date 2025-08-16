import React, { useEffect } from "react";
import HeroSection from "../../components/hero/hero-section";
import CategoryMenu from "../../components/home/CategoryMenu";
import BoostList from "../../components/home/BoostList";
import VodList from "../../components/home/VodList";
import { useAuth } from "../../hooks/useAuth";

const HomePage: React.FC = () => {
  const { isAuthenticated, loadLikedCourses } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadLikedCourses();
    }
  }, [isAuthenticated, loadLikedCourses]);

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
