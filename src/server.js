import express from "express";
import * as personas from "./personas.js";

const app = express();
app.use(express.json());

app.post("/personas", async (req, res) => {
  try {
    const persona = await personas.agregar(req.body);
    res.status(201).json(persona);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/personas", async (_req, res) => {
  const todas = await personas.obtenerTodas();
  res.json(todas);
});

app.delete("/personas/:rut", async (req, res) => {
  try {
    const eliminada = await personas.eliminar(req.params.rut);
    res.json(eliminada);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default app;
