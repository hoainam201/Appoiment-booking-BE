const sequelize = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const HealthService = sequelize.define("health_services", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    speciality: {
        type: DataTypes.INTEGER,
    },
    description: {
        type: DataTypes.TEXT,
    },
    fee: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    avg_rating: {
        type: DataTypes.FLOAT,
        validate: {
            min: 0,
            max: 5,
        }
    },
    charge_of: {
        type: DataTypes.INTEGER,
        references: {
            model: "facility_staffs",
            key: "id",
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "facility_staffs",
            key: "id",
        }
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "facility_staffs",
            key: "id",
        }
    }
});

module.exports = HealthService;