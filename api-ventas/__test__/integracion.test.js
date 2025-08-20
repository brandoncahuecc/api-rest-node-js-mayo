const request = require("supertest");
const { sequelize } = require("../src/config/sequelize");

describe("Api Integracion Test", () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  let accessToken = "";

  it("Geenerar Token JWT", async () => {
    const response = await request("http://localhost:3002")
      .post("/api/auth/login")
      .send({
        name: "brandon",
        password: "Ab123456",
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("accessToken");
    accessToken = response.body.accessToken;

    console.log("Access Token:", accessToken);
  });

  it("Token Invalido", async () => {
    const response = await request("http://localhost:3002")
      .post("/api/auth/login")
      .send({
        name: "brandon",
        password: "Ab123456*",
      });

    expect(response.statusCode).toEqual(401);
  });

  it("Crear Usuario", async () => {
    const nuevoUsuario = {
      name: "brandon.jest",
      email: "brandon2@example.com",
      role: "user",
      password: "Ab123456",
    };

    const response = await request("http://localhost:3000")
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(nuevoUsuario);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual(nuevoUsuario.name);
  });

  it("Listar Ventas", async() => {
    const response = await request("http://localhost:3001")
      .get("/api/ventas")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    console.log("Cantidad de Ventas:", response.body.length);
  })

  it("Listar Ventas sin Token", async() => {
    const response = await request("http://localhost:3001")
      .get("/api/ventas")
      .set("Authorization", `Bearer`);

    expect(response.statusCode).toEqual(401);
  })
});
