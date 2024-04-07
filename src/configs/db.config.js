const { Sequelize } = require("sequelize");
const pg = require("pg");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_POST,
        dialect: "postgres",
        dialectModule: pg,
        logging: false,
        timezone: "+07:00",
        define: {
            timestamps: false,
        }
    },
)

sequelize
    .authenticate()
    .then(() => {
        console.log("Kết nối thành công đến cơ sở dữ liệu");
    })
    .catch((error) => {
        console.error("Lỗi khi kết nối đến cơ sở dữ liệu:", error);
    });

sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((error) => {
        console.log("Error synchronizing database:", error);
    });

module.exports = sequelize;