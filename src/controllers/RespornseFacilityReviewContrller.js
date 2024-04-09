const RFR = require("../models/RespornseFacilityReview");
const sequelize = require("../configs/db.config");


const create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const rfr = await RFR.create(req.body);
        await t.commit();
        res.status(201).json(RFR);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const update = async (req, res) => {
    try {
        const rfr = await RFR.findByPk(req.params.id);
        if (!rfr) {
            return res.status(404).json({message: "User resprone not found"});
        }
        await rfr.update(req.body);
        res.status(200).json(RFR);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const destroy = async (req, res) => {
    try {
        const RFR = await RFR.findByPk(req.params.id);
        if (!RFR) {
            return res.status(404).json({message: "User resprone not found"});
        }
        await RFR.destroy();
        res.status(200).json({message: "User resprone deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


module.exports = {
    create,
    update,
    destroy,
}