const Diagnosis = require("../models/Diagnosis");
const sequelize = require("../configs/db.config");
const {QueryTypes} = require("sequelize");

const update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;
        const description = req.body.description;
        const updated_at = new Date();
        const diagnosis = await Diagnosis.update({
            description: description,
            updated_at: updated_at
        }, {
            where: {
                id: id
            }
        });
        if (diagnosis) {
            await t.commit();
            res.status(200).json({message: "Diagnosis updated successfully"});
        } else {
            await t.rollback();
            res.status(404).json({message: "Diagnosis not found"});
        }

    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}


module.exports = {
    update
}