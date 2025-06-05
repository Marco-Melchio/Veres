const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
});

async function init() {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        data JSON NOT NULL
      )`
    );
  } catch (err) {
    console.error('ERROR     | Datenbankverbindung fehlgeschlagen:', err.message);
    throw err;
  }
}

module.exports = { pool, init };
