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
    image: {
        type: DataTypes.STRING,
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
    facility_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "health_facilities",
            key: "id",
        },
    },
    avg_rating: {
        type: DataTypes.FLOAT,
    },
    charge_of: {
        type: DataTypes.STRING,
        references: {
            model: "facility_staffs",
            key: "email",
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "facility_staffs",
            key: "email",
        }
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_by: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "facility_staffs",
            key: "email",
        }
    }
});

module.exports = HealthService;