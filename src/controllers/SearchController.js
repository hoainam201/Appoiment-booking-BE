const HealthFacility = require("../models/HealthFacility");
const HealthService = require("../models/HealthService");
const {Op} = require("sequelize");
const {serviceTypes} = require("../utils/constants");

const search = async (req, res) => {
    try {
        const query = req.query.q;
        const healthFacilitys = await HealthFacility.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${query}%`
                },
                active: true,
            }
        });
        const doctors = await HealthService.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${query}%`
                },
                active: true,
                type: serviceTypes.DOCTOR,
            }
        });
        const packages = await HealthService.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${query}%`
                },
                active: true,
                type: serviceTypes.PACKAGE,
            }
        });
        res.status(200).json({
            healthFacility: healthFacilitys,
            doctors: doctors,
            packages: packages,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {search};