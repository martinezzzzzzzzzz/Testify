const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',      // o tu contraseña
  database: 'testify'
});

module.exports = pool;
