const {DataTypes} = require("sequelize");
const sequelize = require("../configs/db.config");
const User = require("./User");
const DoctorReview = require("./DoctorReview");

const UserResponseDoctorReview = sequelize.define("user_response_doctor_reviews", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: "users",
      key: "id",
    },
  },
  doctor_review_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: "doctor_reviews",
      key: "id",
    },
  },
  liked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  timestamps: false
})

module.exports = UserResponseDoctorReview;