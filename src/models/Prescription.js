const db = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const Prescriptions = db.define(
    "prescriptions",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        diagnosis_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "diagnoses",
                key: "id",
            },
        },
        drug: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instruction: {
            type: DataTypes.STRING
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
        },
    },
    {
        timestamps: false
    }
);

module.exports = Prescriptions;