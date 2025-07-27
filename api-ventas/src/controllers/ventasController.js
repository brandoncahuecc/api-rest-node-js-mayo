const { Sale } = require("../config/sequelize");
const axios = require("axios");
const { publicarMensaje } = require("../utils/rabbitmqEmisor");

const API_USUARIO_URL = process.env.API_USUARIO_URL;

exports.crearVenta = async (req, res) => {
  try {
    const { user_id, total_amount } = req.body;

    if (!user_id || !total_amount) {
      return res
        .status(400)
        .json({ mensaje: "Usuario Id y Monto Total son requeridos" });
    }

    await axios.get(`${API_USUARIO_URL}/${user_id}`).catch(function (error) {
      console.error(error);
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    });

    const nuevaVenta = await Sale.create({ user_id, total_amount });

    await publicarMensaje({
      type: "venta_creada",
      saleId: nuevaVenta.isSoftDeleted,
      userId: nuevaVenta.user_id,
      userEmail: "brandoncahuec@gmail.com",
      totalAmout: nuevaVenta.total_amount,
      timestamp: new Date(),
    });

    res.status(201).json(nuevaVenta);
  } catch (error) {
    console.error("Error al crear la venta", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Sale.findAll();
    res.json(ventas);
  } catch (error) {
    console.error("Error al obtener las ventas", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerVentaPorUsuarioId = async (req, res) => {
  try {
    const user_id = parseInt(req.params.userId);

    let usuario = {};

    await axios
      .get(`${API_USUARIO_URL}/${user_id}`)
      .then(function (response) {
        usuario = { ...response.data, ventas: [] };
      })
      .catch(function (error) {
        console.error("Error al obtener las ventas", error);
        //return res.status(404).json({ mensaje: "Usuario no encontrado" });
      });

    const listaVentas = await Sale.findAll({ where: { user_id } });
    usuario.ventas = listaVentas;
    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener las ventas", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
