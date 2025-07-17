const pool = require('../config/db');
const { comparePassword } = require('../utils/hash');
const bcrypt = require('bcrypt');

// REGISTRO
exports.register = async (req, res) => {
  const { username, name, email, password, role, avatar_url, bio } = req.body;

  if (!username || !email || !password || !role || !name) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  if (!['profesor', 'estudiante'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (username, name, email, password_hash, role, avatar_url, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, name, email, hashedPassword, role, avatar_url || null, bio || null]
    );

    res.json({ success: true, message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
      bio: user.bio
    };

    res.json({ success: true, user: req.session.user });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Sesión cerrada correctamente' });
  });
};
