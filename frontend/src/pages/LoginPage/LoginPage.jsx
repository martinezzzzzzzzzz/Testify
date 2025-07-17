import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3001/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate('/exams');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card animate-pop">
        <h1 className="login-title">Bienvenido a<img src="/src/images/logotipe_testify.png"/></h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail className="icon" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">Ingresar</button>

          <p className="register-text">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
