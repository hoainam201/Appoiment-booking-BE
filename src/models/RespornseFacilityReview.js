const db = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const RespornseFacilityReview = db.define("respornse_facility_reviews", {
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

module.exports = RespornseFacilityReview;