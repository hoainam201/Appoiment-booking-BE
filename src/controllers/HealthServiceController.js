const HealthService = require("../models/HealthService");
const {serviceType} = require("../utils/constants");
const {sequelize} = require("../configs/db.config");

const getAllDoctors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const maxPage = Math.ceil((await HealthService.count()) / 20);
        if (page > maxPage) {
            return res.status(404).json({message: "Page not found"});
        }
        const doctors = await HealthService.findAndCountAll({
            offset: (page - 1) * 10,
            limit: 20
        },{
            where: {
                type: serviceType.DOCTOR,
            }
        })
        res.status(200).json({
            doctors: doctors,
            maxPage: maxPage
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getAllPackages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const maxPage = Math.ceil((await HealthService.count()) / 20);
        if (page > maxPage) {
            return res.status(404).json({message: "Page not found"});
        }
        const packages = await HealthService.findAndCountAll({
            offset: (page - 1) * 10,
            limit: 20
        },{
            where: {
                type: serviceType.PACKAGE,
            }
        })
        res.status(200).json({
            packages: packages,
            maxPage: maxPage
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const name = req.body.name ? req.body.name : null;
        const type = req.body.type ? req.body.type : null;
        const speciality = req.body.speciality ? req.body.speciality : null;
        const description = req.body.description ? req.body.description : null;
        const fee = req.body.fee ? req.body.fee : null;
        const active = req.body.active ? req.body.active : true;
        const avg_rating =  0;
        const created_by = req.staff.id;
        const updated_by = req.staff.id;
        const service =  await HealthService.create({
            name: name,
            type: type,
            speciality: speciality,
            description: description,
            fee: fee,
            active: active,
            avg_rating: avg_rating,
            created_by: created_by,
            updated_by: updated_by
        }, {transaction: t});
        await t.commit();
        res.status(200).json({message: "Health service created"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const findById = async (req, res) => {
    const id = req.params.id ? req.params.id : null;
    const service = await HealthService.findOne({
        where: {
            id: id
        }
    });
    if (!service) {
        return res.status(404).json({message: "Health service not found"});
    }
    res.status(200).json({service: service});
}

const update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id ? req.params.id : null;
        const service = await HealthService.findOne({
            where: {
                id: id
            }
        });
        if (!service) {
            return res.status(404).json({message: "Health service not found"});
        }
        service.name = req.body.name ? req.body.name : service.name;
        service.type = req.body.type ? req.body.type : service.type;
        service.speciality = req.body.speciality ? req.body.speciality : service.speciality;
        service.description = req.body.description ? req.body.description : service.description;
        service.fee = req.body.fee ? req.body.fee : service.fee;
        service.active = req.body.active ? req.body.active : service.active;
        service.updated_by = req.staff.id;
        await service.save({transaction: t});
        await t.commit();
        res.status(200).json({message: "Health service updated"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAllDoctors,
    getAllPackages,
    create,
    update,
    findById
}