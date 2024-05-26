const {DataTypes} = require("sequelize");
const sequelize = require("../configs/db.config");

const FacilityResponse = sequelize.define("facility_responses", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    facility_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "health_facilities",
            key: "id",
        },
    },
    facility_review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "facility_reviews",
            key: "id",
        },
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
})

module.exports = FacilityResponse;