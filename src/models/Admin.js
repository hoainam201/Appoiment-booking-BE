const {DataTypes} = require("sequelize");
const sequelize = require("../configs/db.config");

const Admin = sequelize.define("admins", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
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
},
{
  timestamps: false,
  defaultScope: {
    attributes: {exclude: ["password"]},
  },
  scopes: {
    withPassword: {
      attributes: {
        include: ["password"],
      },
    },
  }
});

module.exports = Admin;