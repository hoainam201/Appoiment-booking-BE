const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sequelize = require("../db");

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
        const user = await User.findOne({where: {email: req.body.email, password: req.body.password}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: "1h"});
        res.status(200).json(`Bearer ${token}`);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const email = req.body.email || "";
        const phone = req.body.phone || "";
        const password = req.body.password || "";
        const name = req.body.name || "";
        if (!email || !phone) {
            return res.status(400).json({message: "Email and phone are required"});
        }
        const checkMail = await User.findOne({where: {email: req.body.email}});
        if (checkMail) {
            res.status(400).json({message: "Email already exists"});
        }
        const checkPhone = await User.findOne({where: {phone: req.body.phone}});
        if (checkPhone) {
            res.status(400).json({message: "Phone already exists"});
        }
        const user = await User.create(req.body);
        await t.commit();
        res.status(201).json(user);
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