import HeroSection from "./components/hero/hero-section.tsx";
import MyPage from "./pages/mypage/MyPage.tsx";
import Header from "./components/header/header.tsx";
import RegisterPage from "./pages/register/RegisterPage.tsx";
import CoursePage from "./pages/course/CoursePage.tsx";
import "./index.css";

function App() {
  return (
    <>
      <Header />
      <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
        <HeroSection />
        <RegisterPage />
        <MyPage />
        <CoursePage />
        <div className="mt-4 flex gap-4"></div>
      </main>
    </>
  );
}

export default App;
