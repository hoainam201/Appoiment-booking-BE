const {DataTypes} = require("sequelize");
const sequelize = require("../configs/db.config");
const User = require("./User");
const Doctor = require("./Doctor");
const UserResponseDoctorReview = require("./UserResponseDoctorReview");

const DoctorReview = sequelize.define("doctor_reviews", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Doctor,
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
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          length: {
            args: [1, 500],
            msg: "Comment must be between 1 and 500 characters"
          }
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
}, {
    timestamps: false,
});

module.exports = DoctorReview