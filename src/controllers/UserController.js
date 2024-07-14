const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sequelize = require("../configs/db.config");
const crypt = require("../utils/crypt");
const transporter = require("../configs/transporter.config");
const generateNewPassword = require("../utils/generateNewPassword");

const findUser = async (req, res) => {
    try {
        res.status(200).json(req.user);
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
        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: "7d"});
        user.token = token;
        await user.save();
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
        passwordEncrypted = await crypt.hashPassword(password);
        await User.create({
            email: email.toLowerCase(),
            password: passwordEncrypted,
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

const changePassword = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const user = await User.scope("withPassword").findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        if (!await crypt.comparePassword(req.body.oldPassword, user.password)) {
            return res.status(401).json({message: "Wrong password"});
        }
        await user.update({password: await crypt.hashPassword(req.body.newPassword)});
        await t.commit();
        res.status(200).json({message: "Change password success"});
    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const forgotPassword = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const user = await User.findOne({where: {email: req.body.email}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const newPassword = await generateNewPassword();
        const hashedPassword = await crypt.hashPassword(newPassword);
        await user.update({password: hashedPassword});
        await t.commit();

        // Cấu hình nội dung email
        const mailOptions = {
            from: 'mayurijedgement@gmail.com',
            to: user.email,
            subject: 'Thay đổi mật người dùng',
            text: `Mật khẩu của bạn đã được thay đổi thành: \"${newPassword}\"\nVui lòng đổi lại mật khẩu mới khi đăng nhập!!!!`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.status(200).json({message: "Mật khẩu mới đã được gửi đến email của bạn!"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const inactive = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        await user.update({active: false});
        await t.commit();
        res.status(200).json({message: "Inactive user success"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const active = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        await user.update({active: !user.active});
        await t.commit();
        res.status(200).json({message: "Active user success"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const getAll = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    findUser,
    login,
    createUser,
    updateUser,
    changePassword,
    forgotPassword,
    inactive,
    active,
    getAll,
}