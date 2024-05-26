const db = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const Diagnosis = db.define(
    "diagnoses",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        booking_id: {
            type: DataTypes.INTEGER,
            // allowNull: false,
            references: {
                model: "bookings",
                key: "id"
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE
        },
        updated_at: {
            type: DataTypes.DATE
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Diagnosis;