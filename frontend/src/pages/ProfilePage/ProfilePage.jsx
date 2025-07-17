import React from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <div className="profile-wrapper"><p>No has iniciado sesión.</p></div>;
  }

  const handleEdit = (field) => {
    alert(`Funcionalidad para editar "${field}" próximamente.`);
  };

  return (
    <div className="profile-wrapper">
      <h1 className="profile-title">Tu perfil</h1>

      <div className="profile-top">
        <img className="profile-avatar" src={user.avatar_url} alt="Avatar" />
        <div>
          <p className="profile-upload-text">Sube una foto del perfil.</p>
          <button className="upload-btn" onClick={() => handleEdit('foto')}>Subir foto</button>
        </div>
      </div>

      <div className="profile-section">
        <label>Nombre</label>
        <div className="section-content">
          <span>{user.name}</span>
          <button onClick={() => handleEdit('nombre')}>Editar</button>
        </div>
      </div>

      <div className="profile-section">
        <label>Correo electrónico</label>
        <div className="section-content">
          <span>{user.email}</span>
          <button onClick={() => handleEdit('email')}>Editar</button>
        </div>
      </div>

      <div className="profile-section">
        <label>Nombre de usuario</label>
        <div className="section-content">
          <span>@{user.username}</span>
          <button onClick={() => handleEdit('username')}>Editar</button>
        </div>
      </div>

      <div className="profile-section">
        <label>Rol</label>
        <div className="section-content">
          <span>{user.role}</span>
        </div>
      </div>

      <div className="profile-section">
        <label>Biografía</label>
        <div className="section-content">
          <span>{user.bio || 'Sin biografía aún.'}</span>
          <button onClick={() => handleEdit('bio')}>Editar</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
