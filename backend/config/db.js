import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

const createPool = () => {
  try {
    return mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      decimalNumbers: true, // Untuk handling numeric values
    });
  } catch (error) {
    console.error("❌ Gagal membuat database pool:", error);
    process.exit(1);
  }
};

const db = createPool();

export default db;
