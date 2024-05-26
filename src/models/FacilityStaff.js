const db = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const FacilityStaff = db.define(
    "facility_staffs", {
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
        facility_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "health_facilities",
                key: "id",
            },
        },
        speciality:{
            type: DataTypes.INTEGER,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        token: {
            type: DataTypes.STRING,
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
        defaultScope: {
            attributes: {
                exclude: ["password"],
            }
        },
        scopes: {
            withPassword: {
                attributes: {
                    include: ["password"],
                },
            },
        }
    }
);

module.exports = FacilityStaff;