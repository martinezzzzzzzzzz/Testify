// src/components/Layout/Layout.jsx

import React from "react";
import Navbar from "../Navbar/Navbar";

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar user={user} />
      <main>{children}</main>
    </>
  );
};

export default Layout;
