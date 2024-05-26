const db = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const ServiceReviewRes = db.define("service_reviews_res", {
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
    is_like: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
});

module.exports = ServiceReviewRes;