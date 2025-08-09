const { User, RefreshToken } = require("../config/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;
const JWT_TOKEN_EXPIRATION = process.env.JWT_TOKEN_EXPIRATION;
const JWT_TOKEN_REFRESH_EXPIRATION = process.env.JWT_TOKEN_REFRESH_EXPIRATION;

const generarToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_TOKEN_EXPIRATION }
  );

  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET_REFRESH, {
    expiresIn: JWT_TOKEN_REFRESH_EXPIRATION,
  });

  return { accessToken, refreshToken };
};

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ where: { name } });

    if (!user) {
      return res.status(401).json({ mensaje: "Usuario no existe" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ mensaje: "Credenciales invalidas" });
    }

    const { accessToken, refreshToken } = generarToken(user);

    await RefreshToken.destroy({ where: { user_id: user.id } });
    await RefreshToken.create({ user_id: user.id, token: refreshToken });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error al crear la venta", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ mensaje: "Token de refresco es requerido" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET_REFRESH);
    const tokenAlmacenado = await RefreshToken.findOne({
      where: { token, user_id: payload.id },
    });
    if (!tokenAlmacenado) {
      return res.status(403).json({ mensaje: "Token de refresco es invalido" });
    }

    const user = await User.findOne({ where: { id: payload.id } });
    
    const { accessToken } = generarToken(user);

    res.json({ accessToken });
  } catch (error) {
    console.error("Error al crear la venta", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.logout = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ mensaje: "Token de refresco es requerido" });
  }

  try {
    await RefreshToken.destroy({
      where: { token },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error al crear la venta", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
