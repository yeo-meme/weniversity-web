import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { useAppSelector, useAppDispatch } from "./hooks/hook.ts";
import { goToMain, goToLogin } from "./store/slices/lecture-slice.ts";
import "./index.css";

//로그인
import { logout } from "./auth/authSlice.ts";

//page
import LoginPage from "./page/login/login.tsx";
import MyLectures from "./page/my-lectures/my-lectures.tsx";
import Header from "./components/header/header.tsx";
import HeroSection from "./components/hero/hero-section.tsx";

function AppContent() {
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  // const { currentPage } = useAppSelector((state) => state.lecture);

  // 로그인 성공 시
  const handleLoginSuccess = () => {
    dispatch(goToMain());
  };

  // 로그아웃 시
  const handleLogout = () => {
    dispatch(logout());
    dispatch(goToMain());
  };

  if (currentPage === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoToMain={() => dispatch(goToMain())}
      />
    );
  }

  if (currentPage === "my-lectures") {
    return (
      <>
        <Header
          isLoggedIn={isAuthenticated}
          onLogin={() => dispatch(goToLogin())}
          onLogout={handleLogout}
          onGoToMain={() => dispatch(goToMain())}
        />
        <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
          <MyLectures />
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        isLoggedIn={isAuthenticated}
        onLogin={() => dispatch(goToLogin())}
        onLogout={handleLogout}
        onGoToMain={() => dispatch(goToMain())}
      />
      <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
        <HeroSection
          isLoggedIn={isAuthenticated}
          onLogin={() => dispatch(goToLogin())}
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
