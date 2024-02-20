const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const FacilityReview = require("./FacilityReview");

const UserResprone = sequelize.define("user_resprones", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
    },
    facility_review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: FacilityReview,
            key: "id",
        },
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
},{
    timestamps: false,
});

module.exports = UserResprone