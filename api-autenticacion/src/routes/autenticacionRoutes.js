const express = require("express");
const router = express.Router();
const autenticacionController = require("../controllers/autenticacionController");

router.post("/login", autenticacionController.login);
router.post("/refresh-token", autenticacionController.refreshToken);
router.post("/logout", autenticacionController.logout);

module.exports = router;
