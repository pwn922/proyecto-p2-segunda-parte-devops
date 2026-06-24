import pool from "./db.js";

export async function inicializarBaseDeDatos() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS personas (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      rut VARCHAR(50) UNIQUE NOT NULL,
      fecha_nacimiento DATE NOT NULL,
      ciudad VARCHAR(255) NOT NULL
    )
  `);
}
