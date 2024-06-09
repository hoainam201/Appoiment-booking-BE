const db = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const Favourite = db.define("favourites", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "users",
            key: "id",
        },
    },
    service_review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "service_reviews",
            key: "id",
        },
    },
});

module.exports = Favourite;