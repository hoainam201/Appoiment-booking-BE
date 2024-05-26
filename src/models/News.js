const {DataTypes} = require("sequelize");
const sequelize = require("../configs/db.config");

const News = sequelize.define("news", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    doc_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "facility_staffs",
            key: "id",
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [1, 100],
                msg: "Title must be between 1 and 100 characters"
            }
        }
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    banner:{
        type: DataTypes.STRING,
    },
    content: {
        type: DataTypes.TEXT,
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

module.exports = News;