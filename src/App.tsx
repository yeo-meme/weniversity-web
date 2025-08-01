import "./App.css";
import Header from "./components/header/header.tsx";
import HeroSection from "./components/hero/hero-section.tsx";
import "./index.css";

function App() {
  return (
    <>
      <Header />
      <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
        <HeroSection />
      </main>
    </>
  );
}

export default App;
