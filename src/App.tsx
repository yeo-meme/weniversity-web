// import React from "react";
import Header from "./components/header/header.tsx";
import HeroSection from "./components/hero/hero-section.tsx";
import "./index.css";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import MyPage from "./pages/mypage/MyPage.tsx";

function App() {
  return (
    <>
      <Header />
      <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
        <HeroSection />
        <RegisterPage />
        <MyPage />
        <div className="mt-4 flex gap-4"></div>
      </main>
    </>
  );
}

export default App;
