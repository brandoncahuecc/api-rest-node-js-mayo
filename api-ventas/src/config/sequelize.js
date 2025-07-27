require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    deffine: {
      timestamps: true,
      underscored: true,
    },
  }
);

const Sale = sequelize.define("sale", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sale_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

async function syncBaseDatos() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a base de datos exitosa");
    await sequelize.sync();
    console.log("Modelo de Ventas sincronizado a la base de datos");
  } catch (error) {
    console.error("Error al conectarme a la base de datos:", error);
    process.exit(1);
  }
}

syncBaseDatos();

module.exports = { sequelize, Sale };
