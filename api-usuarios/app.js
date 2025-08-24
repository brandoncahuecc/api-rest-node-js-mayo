require("dotenv").config();
const express = require("express");
const logger = require("./src/config/logger");

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
  logger.warn(`Ruta no encontrada: ${req.originalUrl}`);
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  logger.info(`Servidor escuchando en http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  logger.error(`Error global no capturado: ${err.message}`, err);
  res.status(500).json({ mensaje: "Error interno del servidor" });
});
