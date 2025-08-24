const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const JWT_SECRET = process.env.JWT_SECRET;

const autenticacionMiddleware = (req, res, next) => {
  const autHeader = req.headers["authorization"];
  if (!autHeader) {
    logger.warn("Token de acceso no proporcionado");
    return res
      .status(401)
      .json({ mensaje: "Token de acceso no proporcionado" });
  }

  const token = autHeader.split(" ")[1];
  if (!token) {
    logger.warn("Formato del token invalido");
    return res.status(401).json({ mensaje: "Formato del token invalido" });
  }

  try {
    const decode = jwt.decode(token, JWT_SECRET);
    req.user = decode;
    logger.info(`Token verificado exitosamente para usuario: ${decode.id}`);
    next();
  } catch (error) {
    logger.error(`Error al verificar token: ${error.message}`, error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

module.exports = autenticacionMiddleware;
