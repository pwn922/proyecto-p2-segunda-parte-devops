import request from "supertest";
import app from "../src/server.js";
import * as personas from "../src/personas.js";

beforeEach(() => {
  personas.reset();
});

describe("POST /personas", () => {
  test("agrega una persona correctamente", async () => {
    const res = await request(app).post("/personas").send({
      nombre: "Juan Perez",
      rut: "12.345.678-9",
      fechaNacimiento: "1990-05-15",
      ciudad: "Santiago",
    });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      nombre: "Juan Perez",
      rut: "12.345.678-9",
    });
  });

  test("rechaza si faltan campos", async () => {
    const res = await request(app).post("/personas").send({ nombre: "Juan" });
    expect(res.status).toBe(400);
  });

  test("rechaza RUT duplicado", async () => {
    await request(app).post("/personas").send({
      nombre: "Juan",
      rut: "1-9",
      fechaNacimiento: "2000-01-01",
      ciudad: "A",
    });
    const res = await request(app).post("/personas").send({
      nombre: "Ana",
      rut: "1-9",
      fechaNacimiento: "2000-01-01",
      ciudad: "B",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("RUT");
  });
});

describe("GET /personas", () => {
  test("retorna lista vacía al inicio", async () => {
    const res = await request(app).get("/personas");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("retorna todas las personas agregadas", async () => {
    await request(app).post("/personas").send({
      nombre: "A",
      rut: "1",
      fechaNacimiento: "2000-01-01",
      ciudad: "X",
    });
    await request(app).post("/personas").send({
      nombre: "B",
      rut: "2",
      fechaNacimiento: "2000-01-02",
      ciudad: "Y",
    });
    const res = await request(app).get("/personas");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe("DELETE /personas/:rut", () => {
  test("elimina una persona existente", async () => {
    await request(app).post("/personas").send({
      nombre: "Juan",
      rut: "1-9",
      fechaNacimiento: "2000-01-01",
      ciudad: "Z",
    });
    const res = await request(app).delete("/personas/1-9");
    expect(res.status).toBe(200);
    expect(res.body.rut).toBe("1-9");
  });

  test("retorna 404 si la persona no existe", async () => {
    const res = await request(app).delete("/personas/no-existe");
    expect(res.status).toBe(404);
  });
});

describe("POST → GET → DELETE → GET", () => {
  test("flujo completo de solicitudes", async () => {
    await request(app).post("/personas").send({
      nombre: "Ana",
      rut: "1",
      fechaNacimiento: "1990-01-01",
      ciudad: "Santiago",
    });
    await request(app).post("/personas").send({
      nombre: "Luis",
      rut: "2",
      fechaNacimiento: "1995-05-05",
      ciudad: "Valparaíso",
    });

    let res = await request(app).get("/personas");
    expect(res.body).toHaveLength(2);

    res = await request(app).delete("/personas/1");
    expect(res.status).toBe(200);

    res = await request(app).get("/personas");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].nombre).toBe("Luis");
  });
});
