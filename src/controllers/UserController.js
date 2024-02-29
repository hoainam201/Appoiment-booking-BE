const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sequelize = require("../db");
const crypt = require("../utils/crypt");

const findUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({message: "Email and password are required"});
        }
        const user = await User.scope("withPassword").findOne({where: {email: req.body.email}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        if (!await crypt.comparePassword(req.body.password, user.password)) {
            return res.status(401).json({message: "Wrong password"});
        }
        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: "1h"});
        console.log(user);
        res.status(200).json({token: `${token}`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const email = req.body.email || "";
        const password = req.body.password || "";
        const name = req.body.name || "";
        if (!email || !password || !name) {
            return res.status(400).json({message: "Yêu cầu điền đầy đủ thông tin"});
        }
        const checkMail = await User.findOne({where: {email: req.body.email}});
        if (checkMail) {
            return res.status(409).json({message: "Email đã tồn tại"});
        }
        const user = await User.create({
            email: email,
            password: await crypt.hashPassword(password),
            name: name
        });
        await t.commit();
        res.status(200).json({message: "Đăng ký thành công!"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
};

const updateUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        await user.update(req.body);
        await t.commit();
        res.status(200).json(user);
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    findUser,
    login,
    createUser,
    updateUser
}