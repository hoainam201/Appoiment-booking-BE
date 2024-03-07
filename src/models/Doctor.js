const {DataTypes} = require("sequelize");
const sequelize = require("../db");

const Health_facility = require("./HealthFacility");

const Doctor = sequelize.define("doctors", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    health_facility_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Health_facility,
            key: "id",
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    speciality: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fee_per_cunsultation: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    degree: {
        type: DataTypes.STRING,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Bác sĩ"
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    defaultScope: {
        attributes: {
            exclude: ["password"],
        },
    },
    scopes: {
        withPassword: {
            attributes: {
                include: ["password"],
            },
        },
    }
});

Doctor.belongsTo(Health_facility,{
    foreignKey: "health_facility_id",
    as: "health_facility",
});

module.exports = Doctor;