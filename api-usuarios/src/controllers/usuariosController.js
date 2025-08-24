const pool = require("../config/db");
const bcrypt = require("bcrypt");
const logger = require("../config/logger");

exports.obtenerUsuarios = async (req, res, next) => {
  try {
    logger.info("Iniciando obtener todos los usuarios")
    const [users] = await pool.query("SELECT * FROM users");
    logger.info("Usuarios obtenidos exitosamente");

    res.json(users);
  } catch (error) {
    logger.error(`Error al obtener usuarios: ${error.message}`, error);

    if(error.code === 'ER_ACCESS_DENIED_ERROR'
      || error.code === 'PROTOCOL_CONNECTION_LOST'
    ) {
      logger.error('Error de conexión a la base de datos, devolviendo lista vacía');
      return res.json([]);
    }
    
    next(error);
  }
};

exports.obtenerUnUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    logger.info(`Iniciando obtener usuario con ID: ${id}`);
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

    if (users && users.length > 0) {
      logger.info(`Usuario encontrado: ${JSON.stringify(users[0])}`);
      res.json(users[0]);
    } else {
      logger.warn(`Usuario con ID ${id} no encontrado`);
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    logger.error(`Error al obtener usuario con ID ${id}: ${error.message}`, error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    logger.info(`Iniciando creación de usuario con nombre: ${name} y email: ${email}`);
    if (!name || !email || !password || !role) {
      logger.warn("Faltan campos requeridos");
      return res
        .status(400)
        .json({ mensaje: "Debe ingresar todos los campos requeridos" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES(?, ?, ?, ?)",
      [name, email, passwordHash, role]
    );

    const newUser = { id: result.insertId, name, email, role };
    logger.info(`Usuario creado exitosamente: ${JSON.stringify(newUser)}`);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error(`Error al crear usuario: ${error.message}`, error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, password, role } = req.body;
    logger.info(`Iniciando actualización de usuario con ID: ${id}`);
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
    if (password) {
      query += "password = ?, ";
      const passwordHash = await bcrypt.hash(password, 10);
      params.push(passwordHash);
    }
    if (role) {
      query += "role = ?, ";
      params.push(role);
    }

    query = query.slice(0, -2);
    query += " WHERE id = ?";
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows > 0) {
      logger.info(`Usuario con ID ${id} actualizado exitosamente`);
      const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [
        id,
      ]);

      res.json(users[0]);
    } else {
      logger.warn(`Usuario con ID ${id} no encontrado`);
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    logger.error(`Error al actualizar usuario con ID ${id}: ${error.message}`, error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    logger.info(`Iniciando eliminación de usuario con ID: ${id}`);
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      logger.info(`Usuario con ID ${id} eliminado exitosamente`);
      res.status(204).send();
    } else {
      logger.warn(`Usuario con ID ${id} no encontrado`);
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    logger.error(`Error al eliminar usuario con ID ${id}: ${error.message}`, error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
