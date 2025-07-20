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

    if(users && users.length > 0){
        res.json(users[0]);
    }else{
        res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener usuarios", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.crearUsuario = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ mensaje: "Nombre y Email son requeridos" });
  }

  const newUser = { id: nextId++, name, email };
  usuarios.push(newUser);
  res.status(201).json(newUser);
};

exports.actualizarUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  const usuarioIndex = usuarios.findIndex((u) => u.id === id);

  if (usuarioIndex !== -1) {
    usuarios[usuarioIndex] = {
      ...usuarios[usuarioIndex],
      name: name || usuarios[usuarioIndex].name,
      email: email || usuarios[usuarioIndex].email,
    };

    res.json(usuarios[usuarioIndex]);
  } else {
    res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
};

exports.eliminarUsuario = (req, res) => {
  const id = parseInt(req.params.id);

  const usuarioIndex = usuarios.findIndex((u) => u.id === id);

  if (usuarioIndex !== -1) {
    usuarios.splice(usuarioIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
};
