import React, { useState, useEffect } from "react";
import Header from "./components/header/header.tsx";
import HeroSection from "./components/hero/hero-section.tsx";
import LoginPage from "./page/login/login.tsx";
import "./index.css";

function App() {
  const [currentPage, setCurrentPage] = useState("main");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 초기 로그인 상태 체크
  useEffect(() => {
    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // 로그인 성공 시
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("main");
  };

  // 로그아웃 시
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("main");
  };

  if (currentPage === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoToMain={() => setCurrentPage("main")}
      />
    );
  }

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        onLogin={() => setCurrentPage("login")}
        onLogout={handleLogout}
        onGoToMain={() => setCurrentPage("main")}
      />
      <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
        <HeroSection
          isLoggedIn={isLoggedIn}
          onLogin={() => setCurrentPage("login")}
        />
        <div className="mt-4 flex gap-4"></div>
      </main>
    </>
  );
}

export default App;
