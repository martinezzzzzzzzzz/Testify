import React, { useState } from 'react';
import './RegisterPage.css';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaImage,
  FaQuoteRight,
  FaIdBadge,
  FaUserTag
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'estudiante',
    avatar_url: '',
    bio: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '¡Registro exitoso!' });
        setFormData({
          username: '',
          name: '',
          email: '',
          password: '',
          role: 'estudiante',
          avatar_url: '',
          bio: '',
        });

        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Error al registrarse' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Ocurrió un error en el servidor' });
    }
  };

  return (
    <div className="register-bg">
      <div className="register-container">
        <h2 className="register-title">Crear cuenta</h2>

        {message.text && (
          <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
            {message.text}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaIdBadge className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaUserTag className="input-icon" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select-role"
              required
            >
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
            </select>
          </div>

          <div className="input-group">
            <FaImage className="input-icon" />
            <input
              type="text"
              name="avatar_url"
              placeholder="URL del avatar"
              value={formData.avatar_url}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaQuoteRight className="input-icon" />
            <input
              type="text"
              name="bio"
              placeholder="Biografía"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-btn">
            Registrarse
          </button>
        </form>

        <div className="bottom-text">
          <p className="login-link">
            ¿Ya tienes cuenta?{' '}
            <span onClick={() => navigate('/')} style={{ color: '#4fc3f7', cursor: 'pointer' }}>
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
