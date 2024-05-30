const Prescription = require("../models/Prescription");
const Booking = require("../models/Booking");
const sequelize = require("../configs/db.config");
const {Op} = require("sequelize");

const create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.body.diagnosis_id;
        const drug = req.body.drug;
        const quantity = req.body.quantity;
        const instruction = req.body.instruction;
        const existing = await Prescription.findOne({
            where: {
                diagnosis_id: id,
                drug: {
                    [Op.iLike]: drug
                }
            }
        });
        if (existing) {
            await t.rollback();
            return res.status(409).json({message: "Prescription already exists"});
        }
        const created_at = new Date();
        const updated_at = new Date();
        const prescription = await Prescription.create({
            diagnosis_id: id,
            drug: drug,
            quantity: quantity,
            instruction: instruction,
            created_at: created_at,
            updated_at: updated_at
        }, {transaction: t});
        await t.commit();
        return res.status(200).json(prescription);
    } catch (error) {
        await t.rollback();
        return res.status(500).json(error);
    }
}

const destroy = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;
        const prescription = await Prescription.findByPk(id);
        if (!prescription) {
            return res.status(404).json({message: "Prescription not found"});
        }
        await prescription.destroy();
        await t.commit();
        return res.status(200).json({message: "Prescription deleted successfully"});
    } catch (error) {
        await t.rollback();
        return res.status(500).json(error);
    }
}

const getByDiagnosis = async (req, res) => {
    try {
        const id = req.params.id;
        const booking = await Booking.findByPk(id);
        if (!booking || !booking.diagnosis_id) {
            throw new Error("Booking not found");
        }
        const prescription = await Prescription.findAll({
            where: {
                diagnosis_id: booking.diagnosis_id
            }
        });
        if (!prescription) {
            return res.status(404).json({message: "Prescription not found"});
        }
        return res.status(200).json(prescription);
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    create,
    destroy,
    getByDiagnosis
}