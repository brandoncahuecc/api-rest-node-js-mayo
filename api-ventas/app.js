require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001

require('./src/config/sequelize')

const ventasRouters = require('./src/routes/ventasRoutes')

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hola, bienvenidos al Modulo de ventas");
});

app.use("/api/ventas", ventasRouters);

app.use((req, res, next) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
