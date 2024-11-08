  const {DataTypes} = require("sequelize");
  const sequelize = require("../configs/db.config");

  const HealthFacility = sequelize.define("health_facilities", {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
      },
      avatar: {
          type: DataTypes.STRING,
      },
      address: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      specialities: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      type: {
          type: DataTypes.INTEGER,
      },
      phone: {
          type: DataTypes.STRING,
          unique: true,
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
      },
      avg_rating: {
          type: DataTypes.FLOAT,
      },
      description: {
          type: DataTypes.TEXT,
          allowNull: false,
      },
      active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
      },
      latitude: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      longitude: {
          type: DataTypes.STRING,
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
  }, {
      timestamps: false,
  });

  module.exports = HealthFacility;