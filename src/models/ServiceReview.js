const db = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const ServiceReview = db.define(
    "service_reviews", {
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
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "bookings",
                key: "id",
            },
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 5,
            }
        },
        comment: {
            type: DataTypes.TEXT,
            validate: {
                len: {
                    args: [1, 500],
                    msg: "Comment must be between 1 and 500 characters"
                }
            }
        },
        visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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

module.exports = ServiceReview;