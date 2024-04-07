const db = require("../configs/db.config");
const {DataTypes} = require("sequelize");

const FacilityImage = db.define(
    "facility_images", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        facility_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "facilities",
                key: "id",
            },
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
    }
);

module.exports = FacilityImage;