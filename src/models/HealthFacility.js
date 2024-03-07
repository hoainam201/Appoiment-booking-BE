const {DataTypes} = require("sequelize");
const sequelize = require("../db");

const HealthFacility = sequelize.define("health_facilities", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    avatar: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialities: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    latitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.STRING,
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
    timestamps: false,
});

module.exports = HealthFacility