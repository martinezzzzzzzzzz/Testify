import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../images/logotipe_testify.png'; // Asegúrate de que la ruta sea correcta

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/'); // Redirige a la página de inicio
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Testify logo" className="logo-image" />
        </Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/exams">Inicio</Link></li>

        {!user && (
          <>
            <li><Link to="/login">Iniciar sesión</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
          </>
        )}

        {user && (
          <>
            {user.role === 'admin' && <li><Link to="/dashboard">Dashboard</Link></li>}

            <li ref={dropdownRef} className="dropdown-wrapper">
              <button className="avatar-button" onClick={toggleDropdown}>
                <img
                  src={user.avatar_url}
                  alt="Avatar"
                  className="avatar-image"
                />
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>Ver perfil</Link>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
