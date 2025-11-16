import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        {" "}
        {/* Added container styling */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
