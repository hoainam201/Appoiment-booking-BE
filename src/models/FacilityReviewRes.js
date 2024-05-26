const db = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const FacilityReviewRes = db.define("facility_reviews_res", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "users",
            key: "id",
        },
    },
    facility_review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "facility_reviews",
            key: "id",
        },
    },
    is_like: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
});

module.exports = FacilityReviewRes;