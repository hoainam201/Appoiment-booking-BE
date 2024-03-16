const sequelize = require("../configs/db.config");
const {DataTypes} = require("sequelize");
const Health_facility = require("./HealthFacility");

const HealthPackage = sequelize.define("health_packages", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    health_facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Health_facility,
        key: "id",
      },
    },
    avt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

module.exports = HealthPackage;