import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppSelector, useAppDispatch } from "./hooks/redux-hooks";
import { logout } from "./store/auth-slice";
import Header from "./components/header/header.tsx";
import HeroSection from "./components/hero/hero-section.tsx";
import LoginPage from "./page/login/login.tsx";
import "./index.css";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("main");
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // 로그인 성공 시
  const handleLoginSuccess = () => {
    setCurrentPage("main");
  };

  // 로그아웃 시
  const handleLogout = () => {
    dispatch(logout());
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
        isLoggedIn={isAuthenticated}
        onLogin={() => setCurrentPage("login")}
        onLogout={handleLogout}
        onGoToMain={() => setCurrentPage("main")}
      />
      <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
        <HeroSection
          isLoggedIn={isAuthenticated}
          onLogin={() => setCurrentPage("login")}
        />
        <div className="mt-4 flex gap-4"></div>
      </main>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
