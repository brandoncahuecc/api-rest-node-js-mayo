const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventasController");

router.get("/", ventasController.obtenerVentas);
router.get("/:userId", ventasController.obtenerVentaPorUsuarioId);
router.post("/", ventasController.crearVenta);

module.exports = router;
