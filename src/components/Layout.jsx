import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";
import Footer from "./Footer";
import Breadcrumb from "./Breadcrumb";

export default function Layout() {
  const [open, setOpen] = useState(false);

  // закрытие по ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="app">
      <Header onMenuClick={() => setOpen(true)} />

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="main">
        <Breadcrumb />
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}