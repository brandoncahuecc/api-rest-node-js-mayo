const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventasController");
const autenticacionMiddleware = require("../middlewares/autenticacionMiddleware");

router.get("/", autenticacionMiddleware, ventasController.obtenerVentas);
router.get(
  "/:userId",
  autenticacionMiddleware,
  ventasController.obtenerVentaPorUsuarioId
);
router.post("/", autenticacionMiddleware, ventasController.crearVenta);

module.exports = router;
