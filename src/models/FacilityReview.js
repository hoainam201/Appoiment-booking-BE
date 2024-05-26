const {DataTypes} = require("sequelize");
const sequelize = require("../configs/db.config");
const User = require("./User");

const FacilityReview = sequelize.define("facility_reviews", {
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "bookings",
                key: "id",
            }
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        facility_response_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "facility_respornses",
                key: "id",
            }
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
    },
    {
        timestamps: false,
    });

module.exports = FacilityReview;