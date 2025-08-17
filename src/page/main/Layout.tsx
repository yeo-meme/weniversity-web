import React from "react";
import Header from "../../components/header/header";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer/footer.tsx";

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
