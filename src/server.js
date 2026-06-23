import express from "express";
import * as personas from "./personas.js";

const app = express();
app.use(express.json());

app.post("/personas", (req, res) => {
  try {
    const persona = personas.agregar(req.body);
    res.status(201).json(persona);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/personas", (_req, res) => {
  res.json(personas.obtenerTodas());
});

app.delete("/personas/:rut", (req, res) => {
  try {
    const eliminada = personas.eliminar(req.params.rut);
    res.json(eliminada);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default app;
