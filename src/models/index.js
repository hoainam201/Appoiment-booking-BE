const sequelize = require("../configs/db.config");
const Admin = require("./Admin");
const HealthFacility = require("./HealthFacility");
const User = require("./User");
const

// Đồng bộ hóa model với cơ sở dữ liệu
sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((error) => {
        console.log("Error synchronizing database:", error);
    });