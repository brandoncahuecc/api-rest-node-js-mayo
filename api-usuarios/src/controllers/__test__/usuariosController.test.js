const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const usuariosController = require("../usuariosController");

jest.mock("../../config/db", () => ({
  query: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(() => "hashedPasswordMock"),
  compare: jest.fn(),
}));

describe("usuariosController", () => {
  const mockRequest = {};
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn(() => mockResponse),
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Listar usuarios", async () => {
    const users = [
      {
        id: 1,
        nom: "Jhon Smith",
        email: "jhon.smith@ejemplo.com",
        role: "user",
      },
      {
        id: 2,
        name: "brandon",
        email: "brandon.cahuec@ejemplo.com",
        role: "user",
      },
    ];

    pool.query.mockResolvedValue([users]);

    await usuariosController.obtenerUsuarios(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(users);
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users");
  });

  it("Buscar usuario por ID", async () => {
    const user = [
      {
        id: 22,
        nom: "brandon",
        email: "brandon.cahuec@ejemplo.com",
        role: "user",
      },
    ];

    pool.query.mockResolvedValue([user]);
    mockRequest.params = { id: 23 };

    await usuariosController.obtenerUnUsuario(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(user[0]);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [23]
    );
  });

  it("Buscar usuario por ID no encontrado", async () => {
    pool.query.mockResolvedValue([[]]);
    mockRequest.params = { id: 23 };

    await usuariosController.obtenerUnUsuario(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      mensaje: "Usuario no encontrado",
    });
  });

  it("Crear Usuario", async () => {
    const nuevoUsuario = {
      name: "Nuevo Usuario",
      email: "nuevo.usuario@ejemplo.com",
      password: "password123",
      role: "user",
    };

    mockRequest.body = nuevoUsuario;

    await usuariosController.crearUsuario(mockRequest, mockResponse);

    const expectPasswordHash = "hashedPasswordMock";

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: undefined,
      name: nuevoUsuario.name,
      email: nuevoUsuario.email,
      role: nuevoUsuario.role,
    });

    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO users (name, email, password, role) VALUES(?, ?, ?, ?)",
      [
        nuevoUsuario.name,
        nuevoUsuario.email,
        expectPasswordHash,
        nuevoUsuario.role,
      ]
    );

    expect(bcrypt.hash).toHaveBeenCalledWith(nuevoUsuario.password, 10);
  });

  it("Eliminar usuario", async () => {
    pool.query.mockResolvedValue([{ affectedRows: 1 }]);
    mockRequest.params = { id: 23 };

    await usuariosController.eliminarUsuario(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(pool.query).toHaveBeenCalledWith("DELETE FROM users WHERE id = ?", [
      23,
    ]);
  });

  it("Eliminar usuario no existente", async () => {
    pool.query.mockResolvedValue([{ affectedRows: 0 }]);
    mockRequest.params = { id: 999 };

    await usuariosController.eliminarUsuario(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      mensaje: "Usuario no encontrado",
    });
  });
});
