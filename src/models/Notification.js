const db = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const Notification = db.define(
    "notifications", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
        },
        to_staff_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "facility_staffs",
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
    }
)

module.exports = Notification;