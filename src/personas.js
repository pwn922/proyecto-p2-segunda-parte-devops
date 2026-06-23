import pool from "./db.js";

const personas = [];

export async function agregar({ nombre, rut, fechaNacimiento, ciudad }) {
  if (!nombre || !rut || !fechaNacimiento || !ciudad) {
    throw new Error("Todos los campos son obligatorios");
  }
  if (pool) {
    const existe = await pool.query("SELECT id FROM personas WHERE rut = $1", [rut]);
    if (existe.rows.length > 0) {
      throw new Error("El RUT ya existe");
    }
    const result = await pool.query(
      `INSERT INTO personas (nombre, rut, fecha_nacimiento, ciudad)
       VALUES ($1, $2, $3, $4) RETURNING id, nombre, rut, fecha_nacimiento AS "fechaNacimiento", ciudad`,
      [nombre, rut, fechaNacimiento, ciudad]
    );
    return result.rows[0];
  }
  if (personas.find((p) => p.rut === rut)) {
    throw new Error("El RUT ya existe");
  }
  const persona = {
    id: personas.length + 1,
    nombre,
    rut,
    fechaNacimiento,
    ciudad,
  };
  personas.push(persona);
  return persona;
}

export async function obtenerTodas() {
  if (pool) {
    const result = await pool.query(
      `SELECT id, nombre, rut, fecha_nacimiento AS "fechaNacimiento", ciudad FROM personas`
    );
    return result.rows;
  }
  return personas;
}

export async function eliminar(rut) {
  if (pool) {
    const result = await pool.query(
      `DELETE FROM personas WHERE rut = $1
       RETURNING id, nombre, rut, fecha_nacimiento AS "fechaNacimiento", ciudad`,
      [rut]
    );
    if (result.rows.length === 0) {
      throw new Error("Persona no encontrada");
    }
    return result.rows[0];
  }
  const index = personas.findIndex((p) => p.rut === rut);
  if (index === -1) {
    throw new Error("Persona no encontrada");
  }
  return personas.splice(index, 1)[0];
}

export async function reset() {
  if (pool) {
    await pool.query("DELETE FROM personas");
    return;
  }
  personas.length = 0;
}
