require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión a base de datos exitosa");
    connection.release();
  } catch (error) {
    console.error("Error al conectarme a la base de datos:", error);
    process.exit(1);
  }
}

testConnection();

module.exports = pool;
