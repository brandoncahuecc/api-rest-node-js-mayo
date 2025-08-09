const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const autenticacionMiddleware = (req, res, next) => {
  const autHeader = req.headers["authorization"];
  if (!autHeader) {
    return res
      .status(401)
      .json({ mensaje: "Token de acceso no proporcionado" });
  }

  const token = autHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensaje: "Formato del token invalido" });
  }

  try {
    const decode = jwt.decode(token, JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.error("Error al verificar token:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

module.exports = autenticacionMiddleware;
