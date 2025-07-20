require('dotenv').config()
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const usuariosRoutes = require("./src/routes/usuariosRouter");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola, bienvenidos al curso de Node JS");
});

app.use("/api/usuarios", usuariosRoutes);

app.use((req, res, next) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
