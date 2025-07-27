const pool = require("../config/db");

let usuarios = [
  { id: 1, name: "Jhon Doe", email: "jhon.doe@ejemplo.com" },
  { id: 2, name: "Jhon Smith", email: "jhon.smith@ejemplo.com" },
];

let nextId = 3;

exports.obtenerUsuarios = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerUnUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

    if (users && users.length > 0) {
      res.json(users[0]);
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener usuarios", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ mensaje: "Nombre y Email son requeridos" });
    }

    const [result] = await pool.query(
      "INSERT INTO users (name, email) VALUES(?, ?)",
      [name, email]
    );

    const newUser = { id: result.insertId, name, email };

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al crear usuario", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    let query = "UPDATE users SET ";
    const params = [];
    if (name) {
      query += "name = ?, ";
      params.push(name);
    }
    if (email) {
      query += "email = ?, ";
      params.push(email);
    }

    query = query.slice(0, -2);
    query += " WHERE id = ?";
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows > 0) {
      const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [
        id,
      ]);

      res.json(users[0]);
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar usuario", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar usuario", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
