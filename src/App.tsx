import React from "react";
import Header from "./components/header/header.tsx";
import "./index.css";

function App() {
  return (
    <main className="w-[1190px] max-w-[calc(100% - 32px)] mx-auto">
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-pretendard">
        <Header />
        <div className="mt-4 flex gap-4">
        </div>
      </div>
    </main>
  );
}

export default App;
