import { Routes, Route, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./hooks/hook";
import { logout } from "./auth/authSlice";
import { setCurrentTab } from "./store/slices/pageSlice";

import LoginPage from "./page/login/login";
import MyLectures from "./page/my-lectures/my-lectures";
import Header from "./components/header/header";
import HeroSection from "./components/hero/hero-section";
import TabSync from "./components/TabSync";

function HomePage() {
  const navigate = useNavigate();
  return <HeroSection isLoggedIn={false} onLogin={() => navigate("/login")} />;
}

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const { currentTab } = useAppSelector((state) => state.page); // ✅ page 슬라이스에서 읽기

  // 🔍 디버깅용 로그
  console.log("📌 현재 Redux currentTab:", currentTab);

  const handleLoginSuccess = () => {
    dispatch(setCurrentTab("home"));
    navigate("/");
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setCurrentTab("home"));
    navigate("/");
  };

  console.log(localStorage.getItem("persist:auth"));

  return (
    <>
      <TabSync />
      <Header
        isLoggedIn={isAuthenticated}
        onLogin={() => navigate("/login")}
        onLogout={handleLogout}
        onGoToMain={() => navigate("/")}
      />
      <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/my-lectures"
            element={
              isAuthenticated ? (
                <MyLectures />
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </>
  );
}

export default AppContent;
