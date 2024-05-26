const db = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const Booking = db.define(
    "bookings", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "health_services",
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        charge_of: {
            type: DataTypes.STRING,
            references: {
                model: "facility_staffs",
                key: "email",
            }
        },
        service_review_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "service_reviews",
                key: "id",
            },
        },
        facility_review_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "facility_reviews",
                key: "id",
            },
        },
        diagnosis_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "diagnoses",
                key: "id",
            },
        },
        started_at: {
            type: DataTypes.DATE,
        },
        completed_at: {
            type: DataTypes.DATE,
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
);

module.exports = Booking;