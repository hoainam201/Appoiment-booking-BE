const FacilityStaffController = require("../models/FacilityStaff");
const jwt = require("jsonwebtoken");
const {staffRole} = require("../utils/constants");
const sequelize = require("../configs/db.config");
const crypt = require("../utils/crypt");

const getAllDoctor = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const maxPage = Math.ceil((await FacilityStaffController.count()) / 20);
        if (page > maxPage) {
            return res.status(404).json({message: "Page not found"});
        }
        const doctor = await FacilityStaffController.findAndCountAll({
            offset: (page - 1) * 10,
            limit: 20,
            where: {
                type: staffRole.DOCTOR,
                facility_id: req.staff.facility_id,
            }
        })
        res.status(200).json({
            doctor: doctor,
            maxPage: maxPage
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createDoctor = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const avatar = req.file.patch ? req.file.path : null;
        const facility_id = req.staff.facility_id;
        const role = staffRole.DOCTOR;
        const staff = await FacilityStaffController.create({
            name: name,
            email: email,
            password: password,
            avatar: avatar,
            facility_id: facility_id,
            role: role
        }, {
            transaction: t,
        });
        await t.commit();
        res.status(201).json(
            {
                staff: staff,
                message: "Doctor created successfully",
            }
        );
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const getDoctor = async (req, res) => {
    try {
        const doctor = await FacilityStaffController.findByPk(req.params.id);
        if (!doctor) {
            return res.status(404).json({message: "Doctor not found"});
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getAllManager = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const maxPage = Math.ceil((await FacilityStaffController.count()) / 20);
        if (page > maxPage) {
            return res.status(404).json({message: "Page not found"});
        }
        const manager = await FacilityStaffController.findAndCountAll({
            offset: (page - 1) * 10,
            limit: 20,
            where: {
                type: staffRole.MANAGER,
                facility_id: req.staff.facility_id,
            }
        })
        res.status(200).json({
            manager: manager,
            maxPage: maxPage
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createManager = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const avatar = req.file.patch ? req.file.path : null;
        const facility_id = req.staff.facility_id;
        const role = staffRole.MANAGER;
        const staff = await FacilityStaffController.create({
            name: name,
            email: email,
            password: password,
            avatar: avatar,
            facility_id: facility_id,
            role: role
        }, {
            transaction: t,
        });
        res.status(201).json(
            {
                staff: staff,
                message: "Manager created successfully",
            }
        );
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const staff = await FacilityStaffController.scope("withPassword").findOne({
            where: {
                email: email,
            }
        });
        // console.log(staff);
        if (
            !staff
            // ||
            // !(await crypt.comparePassword(password, staff.password))
        ) {
            console.log("wrong password");
            return res.status(401).json({message: "Invalid email or password"});
        }
        const token = jwt.sign({id: staff.id}, process.env.SECRET_KEY);
        console.log(token);
        res.status(200).json({token: token});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const changePassword = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const staff = await FacilityStaffController.scope("withPassword").findOne({
            where: {
                id: req.staff.id
            }
        });
        const isMatch = await crypt.comparePassword(oldPassword, staff.password);
        if (!isMatch) {
            return res.status(401).json({message: "Wrong password"});
        }
        const passwordEncrypted = await crypt.hashPassword(newPassword);
        await staff.update({password: passwordEncrypted});
        await t.commit();
        res.status(200).json({message: "Change password success"});
    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const inactive = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const staff = await FacilityStaffController.findByPk(req.params.id);
        if (!staff) {
            return res.status(404).json({message: "Doctor not found"});
        }
        await staff.update({active: !staff.active});
        await t.commit();
        res.status(200).json({message: "Doctor deleted successfully"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const getRole = async (req, res) => {
    res.status(200).json(req.staff);
}

module.exports = {
    createDoctor,
    createManager,
    login,
    changePassword,
    getDoctor,
    getAllManager,
    inactive,
    getAllDoctor,
    getRole,
}