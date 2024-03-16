const {DataTypes} = require("sequelize");
const sequelize = require("../configs/db.config");
const User = require("./User");
const FacilityReview = require("./FacilityReview");

const UserResponseFacilityReview = sequelize.define("user_response_facility_reviews", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: User,
      key: "id",
    },
  },
  facility_review_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: FacilityReview,
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
}, {
  timestamps: false,
});

module.exports = UserResponseFacilityReview;