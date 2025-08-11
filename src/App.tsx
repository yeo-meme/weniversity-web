import Header from "./components/header/header.tsx";
import HeroSection from "./components/hero/hero-section.tsx";
import LoginPage from "./page/login/login.tsx";
import "./index.css";

function App() {
  const [currentPage, setCurrentPage] = useState("main");

  if (currentPage === "login") {
    return (
      <LoginPage
        onLoginSuccess={() => setCurrentPage("main")}
        onGoToMain={() => setCurrentPage("main")}
      />
    );
  }

  return (
    <>
      <Header
        onLogin={() => setCurrentPage("login")}
        onLogout={() => setCurrentPage("main")}
        onGoToMain={() => setCurrentPage("main")}
      />
      <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
        <HeroSection />
        <div className="mt-4 flex gap-4"></div>
      </main>
    </>
  );
}

export default App;
