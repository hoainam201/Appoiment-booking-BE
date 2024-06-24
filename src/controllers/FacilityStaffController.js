const FacilityStaff = require("../models/FacilityStaff");
const jwt = require("jsonwebtoken");
const {staffRole} = require("../utils/constants");
const sequelize = require("../configs/db.config");
const crypt = require("../utils/crypt");
const generateNewPassword = require("../utils/generateNewPassword");
const transporter = require("../configs/transporter.config");
const {hashPassword} = require("../utils/crypt");
const {Op} = require("sequelize");

const getAllDoctor = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        if (page > maxPage) {
            return res.status(404).json({message: "Page not found"});
        }
        const doctor = await FacilityStaff.findAndCountAll({
            offset: (page - 1) * 20,
            limit: 20,
            where: {
                type: staffRole.DOCTOR,
                facility_id: req.staff.facility_id,
            }
        })
        res.status(200).json({
            doctor: doctor,
            maxPage: Math.ceil(doctor.count / 20),
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
        const password = await generateNewPassword();
        const facility_id = req.staff.facility_id ;
        const role = req.body.role;
        const speciality = role === staffRole.DOCTOR ? req.body.speciality : null;
        const passwordHash = await hashPassword(password);
        console.log(req.body);
        const staff = await FacilityStaff.create({
            name: name,
            email: email,
            password: passwordHash,
            facility_id: facility_id,
            avatar: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            role: role,
            speciality: speciality,
        }, {
            transaction: t,
        });
        await t.commit();
        const mailOptions = {
            from: 'mayurijedgement@gmail.com',
            to: 'nam.nh194628@sis.hust.edu.vn',
            subject: 'Chào mừng',
            text: `Tài khoản của bạn được tạo thành công\nEmail: \"${email}\"\n Mật khẩu là: \"${password}\"\nVui lòng đổi lại mật khẩu mới khi đăng nhập!!!!`,
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json(
            {
                staff: staff,
                message: "Doctor created successfully",
            }
        );
    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const getDoctor = async (req, res) => {
    try {
        const doctor = await FacilityStaff.findByPk(req.params.id);
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
        const maxPage = Math.ceil((await FacilityStaff.count()) / 20);
        if (page > maxPage) {
            return res.status(404).json({message: "Page not found"});
        }
        const manager = await FacilityStaff.findAndCountAll({
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
        const password = await generateNewPassword();
        const facility_id = req.staff.facility_id ;
        const role = staffRole.MANAGER;
        const passwordHash = await hashPassword(password);
        const staff = await FacilityStaff.create({
            name: name,
            email: email,
            password: passwordHash,
            facility_id: facility_id,
            avatar: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            role: staffRole.MANAGER,
        }, {
            transaction: t,
        });
        await t.commit();
        const mailOptions = {
            from: 'mayurijedgement@gmail.com',
            to: 'nam.nh194628@sis.hust.edu.vn',
            subject: 'Chào mừng',
            text: `Tài khoản của bạn được tạo thành công\nEmail: \"${email}\"\n Mật khẩu là: \"${password}\"\nVui lòng đổi lại mật khẩu mới khi đăng nhập!!!!`,
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json(
            {
                staff: staff,
                message: "The manager was created successfully",
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
        const staff = await FacilityStaff.scope("withPassword").findOne({
            where: {
                email: email,
                active: true,
            }
        });
        // console.log(staff);
        if (
            !staff
            ||
            !(await crypt.comparePassword(password, staff.password))
        ) {
            console.log("wrong password");
            return res.status(401).json({message: "Invalid email or password"});
        }
        const token = jwt.sign({id: staff.id}, process.env.SECRET_KEY);
        staff.token = token;
        await staff.save();
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
        const staff = await FacilityStaff.scope("withPassword").findOne({
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
        const staff = await FacilityStaff.findByPk(req.params.id);
        if (!staff) {
            return res.status(404).json({message: "Staff not found"});
        }
        await staff.update({active: !staff.active});
        await t.commit();
        res.status(200).json({message: "Staff updated successfully"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const getRole = async (req, res) => {
    res.status(200).json(req.staff);
}

const update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const staff = await FacilityStaff.findByPk(req.staff.id);
        if (!staff) {
            return res.status(404).json({message: "Staff not found"});
        }
        await staff.update({
            name: req.body.name,
            avatar: req.file ? req.file.path : staff.avatar,
            updated_at: new Date(),
            speciality: req.body.speciality || null,
        }, {
            transaction: t
        });
        await t.commit();
        res.status(200).json({message: "Staff updated successfully"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const forgetPassword = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const email = req.body.email;
        const staff = await FacilityStaff.findOne({
            where: {
                email: email
            }
        });
        if (!staff) {
            return res.status(404).json({message: "Staff not found"});
        }
        const newPassword = await generateNewPassword();
        const hashedPassword = await crypt.hashPassword(newPassword);
        await staff.update({password: hashedPassword});
        await t.commit();

        // Cấu hình nội dung email
        const mailOptions = {
            from: 'mayurijedgement@gmail.com',
            to: 'nam.nh194628@sis.hust.edu.vn',
            subject: 'Thay đổi mật người dùng',
            text: `Mật khẩu của bạn đã được thay đổi thành: \"${newPassword}\"\nVui lòng đổi lại mật khẩu mới khi đăng nhập!!!!`,
        };

        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({message: "Mật đã được gửi định nghĩa email của bạn!"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const getAllStaffByFacility = async (req, res) => {
    try {
        if (!req.staff.facility_id) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const staffs = await FacilityStaff.findAll({
            where: {
                facility_id: req.staff.facility_id,
                id: {
                    [Op.ne]: req.staff.id
                }
            }
        });
        res.status(200).json(staffs);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getDoctorByManager = async (req, res) => {
    try {
        const staffs = await FacilityStaff.findAll({
            where: {
                facility_id: req.staff.facility_id,
                role: staffRole.DOCTOR,
                active: true,
            }
        });
        if(!staffs || !staffs.length) {
            return res.status(404).json({message: "Staff not found"});
        }
        res.status(200).json(staffs);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
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
    update,
    forgetPassword,
    getAllStaffByFacility,
    getDoctorByManager
}