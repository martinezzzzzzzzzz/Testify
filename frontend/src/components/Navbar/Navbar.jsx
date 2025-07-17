import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user }) {
  return (
    <nav className="navbar">
      <h1 className="navbar__logo">Testify</h1>

      <ul className="navbar__links">
        {user?.role === "estudiante" && (
          <li>
            <Link to="/exams">Exámenes</Link>
          </li>
        )}

        {user?.role === "profesor" && (
          <>
            <li>
              <Link to="/exams">Ver Exámenes</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/">Cerrar Sesión</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
