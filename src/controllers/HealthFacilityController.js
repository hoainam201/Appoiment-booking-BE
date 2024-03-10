const HealthFacility = require("../models/HealthFacility");
const jwt = require("jsonwebtoken");
const {Op} = require("sequelize");
const sequelize = require("../db");
const fileUploader = require("../configs/cloudinary.config");
const Doctor = require("../models/Doctor");

const createHealthFacility = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const name = req.body.name ? req.body.name : null;
        const address = req.body.address ? req.body.address : null;
        const specialities = req.body.specialities ? req.body.specialities : null;
        const phone = req.body.phone ? req.body.phone : null;
        const email = req.body.email ? req.body.email : null;
        const latitude = req.body.latitude ? req.body.latitude : null;
        const longitude = req.body.longitude ? req.body.longitude : null;

        req.file.path = req.file.path || null;

        if (!name || !address || !specialities || !phone || !email || !latitude || !longitude) {
            return res.status(400).json({message: "All fields are required"});
        }
        console.log(name, address, specialities, phone, email, latitude, longitude);

        const healthFacility = await HealthFacility.create({
            name: name,
            address: address,
            specialities: specialities,
            phone: phone,
            email: email,
            avatar: req.file.path,
            latitude: latitude,
            longitude: longitude,
        });
        await t.commit();
        res.status(201).json(healthFacility);
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
};

const getAllHealthFacility = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const maxPage = Math.ceil((await HealthFacility.count()) / 20);
        if(page > maxPage) {
            return res.status(404).json({message: "Page not found"});
        }
        const healthFacility = await HealthFacility.findAll({
            offset: (page - 1) * 20,
            limit: 20
        });
        res.status(200).json({
            healthFacility: healthFacility,
            maxPage: maxPage
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getHealthFacility = async (req, res) => {
    try {
        const name = req.body.name ? req.body.name : null;
        const address = req.body.address ? req.body.address : null;
        const specialities = req.body.specialities ? req.body.specialities : null;
        const latitude = req.body.latitude ? req.body.latitude : null;
        const longitude = req.body.longitude ? req.body.longitude : null;

        const query = {};


        if (latitude && longitude) {
            query.latitude = {
                [Op.between]: [latitude - 0.27, latitude + 0.27]
            };
            query.longitude = {
                [Op.between]: [longitude - 0.27, longitude + 0.27]
            };
        }
        ;

        if (name) {
            query.name = {
                [Op.iLike]: `%${name.toLowerCase()}%`
            }
        }
        if (address) {
            query.address = {
                [Op.iLike]: `%${address}%`
            }
        }
        if (specialities) {
            query.specialities = {
                [Op.iLike]: `%${specialities}%`
            }
        }
        const healthFacility = await HealthFacility.findAll({
            where: query
        });
        if (!healthFacility) {
            return res.status(404).json({message: "Không tìm thấy cơ sở y tế phù hợp"});
        }
        res.status(200).json(healthFacility);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateHealthFacility = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const name = req.body.name ? req.body.name : null;
        // const password = req.body.password ? req.body.password : null;
        const address = req.body.address ? req.body.address : null;
        const specialities = req.body.specialities ? req.body.specialities : null;
        const phone = req.body.phone ? req.body.phone : null;
        const email = req.body.email ? req.body.email : null;
        const latitude = req.body.latitude ? req.body.latitude : null;
        const longitude = req.body.longitude ? req.body.longitude : null;
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
};



const getHealthFacilityById = async (req, res) => {
    try {
        const healthFacility = await HealthFacility.findOne({
            where: {
                id: req.params.id,
                active: true
            }
        });
        if (!healthFacility) {
            return res.status(404).json({message: "Không tìm thấy cơ sở y tế phù hợp"});
        }
        const doctors = await Doctor.findAll({
            attributes: ["id", "name", "fee_per_cunsultation"],
            where: {
                health_facility_id: healthFacility.id
            }
        });
        healthFacility.dataValues.doctors = doctors;
        res.status(200).json(healthFacility);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


module.exports = {
    createHealthFacility,
    getAllHealthFacility,
    getHealthFacility,
    updateHealthFacility,
    getHealthFacilityById,
}