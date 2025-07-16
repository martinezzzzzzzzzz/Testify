const pool = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/hash');

// REGISTRO
exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!['profesor', 'estudiante'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
      [username, hashedPassword, role]
    );

    res.json({ success: true, message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const match = await comparePassword(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role
    };

    res.json({ success: true, user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
};
