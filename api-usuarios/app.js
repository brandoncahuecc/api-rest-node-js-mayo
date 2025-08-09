require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const usuariosRoutes = require("./src/routes/usuariosRouter");
const autenticacionMiddleware = require("./src/middlewares/autenticacionMiddleware");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola, bienvenidos al curso de Node JS");
});

app.use("/api/usuarios", autenticacionMiddleware, usuariosRoutes);

app.use((req, res, next) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
