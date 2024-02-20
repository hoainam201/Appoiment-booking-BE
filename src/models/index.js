const sequelize = require("../db");

// Đồng bộ hóa model với cơ sở dữ liệu
sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((error) => {
        console.log("Error synchronizing database:", error);
    });