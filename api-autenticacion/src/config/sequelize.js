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

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    defaultValue: "user",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const RefreshToken = sequelize.define("refresh_tokens", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
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

module.exports = { sequelize, User, RefreshToken };
