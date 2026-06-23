const personas = [];

function agregar({ nombre, rut, fechaNacimiento, ciudad }) {
  if (!nombre || !rut || !fechaNacimiento || !ciudad) {
    throw new Error("Todos los campos son obligatorios");
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

function obtenerTodas() {
  return personas;
}

function eliminar(rut) {
  const index = personas.findIndex((p) => p.rut === rut);
  if (index === -1) {
    throw new Error("Persona no encontrada");
  }
  return personas.splice(index, 1)[0];
}

function reset() {
  personas.length = 0;
}

export { agregar, obtenerTodas, eliminar, reset };
