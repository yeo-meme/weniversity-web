import React from "react";
import Header from "../../components/header/header";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";
import Footer from "../../components/footer/footer.tsx";

const Layout: React.FC = () => {
  const { isAuthenticated, handleLogout } = useAuth();

  const handleLogoutWithAlert = async () => {
    await handleLogout();
    alert("로그아웃 되었습니다.");
  };

  return (
    <>
      <Header isLoggedIn={isAuthenticated} onLogout={handleLogoutWithAlert} />
      <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
