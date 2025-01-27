import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/header";

const Layout = () => {
  return (
    <main className="bg-gray-100">
      <Header />
      <Outlet />
    </main>
  );
};

export default Layout;
