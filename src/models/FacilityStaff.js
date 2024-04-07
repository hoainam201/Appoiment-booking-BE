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
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [1, 100],
                    msg: "Username must be between 1 and 100 characters"
                }
            }
        },
        facility_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "health_facilities",
                key: "id",
            },
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