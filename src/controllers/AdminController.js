const Admin = require("../models/Admin");
const sequelize = require("../configs/db.config");
const crypt = require("../utils/crypt");

const create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const admin = await Admin.create({
            name: req.body.name,
            avatar: req.body.avatar,
            username: req.body.username,
            email: req.body.email,
            password: crypt.hashPassword(req.body.password),
            created_at: new Date(),
            updated_at: new Date(),
        });
        await t.commit();
        return res.status(200).json(admin);
    }
    catch (err) {
        await t.rollback();
        return res.status(500).json(err);
    }
};

const login = async (req, res) => {
    const admin = await Admin.scope("withPassword").findOne({
        where: {
            username: req.body.username
        }
    });
    if (!admin) {
        return res.status(404).json({message: "Username not found"});
    };
    if (!crypt.comparePassword(req.body.password, admin.password)) {
        return res.status(401).json({message: "Wrong password"});
    }
    return res.status(200).json(admin);
}

module.exports = {
    create,
    login
}