const express = require("express");
const route = express.Router();
const usuarios = require("../controllers/usuariosController");

route.get("/", usuarios.obtenerUsuarios);
route.get("/:id", usuarios.obtenerUnUsuario);
route.post("/", usuarios.crearUsuario);
route.put("/:id", usuarios.actualizarUsuario);
route.delete("/:id", usuarios.eliminarUsuario);

module.exports = route;
