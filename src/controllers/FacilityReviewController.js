const FacilityReview = require("../models/FacilityReview");
const HealthFacility = require("../models/HealthFacility");
const sequelize = require("../configs/db.config");

const updateRating = async (id) => {
    const query = `SELECT AVG(rating) as rating FROM facility_reviews WHERE facility_id = ${id}`;
    const data = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
    const rating = (data[0].rating * 10) / 10;
    await HealthFacility.update({rating: rating}, {where: {id: id}});
}

const getAll = async (req, res) => {
    try {
        const facilityReview = await FacilityReview.findAll({
            where: {
                facility_id: req.query.facility_id,
            }
        });
        res.status(200).json(facilityReview);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const rating = req.body.rating;
        const facility_id = req.body.facility_id;
        const user_id = req.user.id;
        const booking_id = req.body.booking_id ? req.body.booking_id : null;
        const comment = req.body.comment ? req.body.comment : null;
        const facilityReview = await FacilityReview.create({
            rating: rating,
            facility_id: facility_id,
            user_id: user_id,
            booking_id: booking_id,
            comment: comment
        }, {
            transaction: t
        });
        await t.commit();
        await updateRating(facility_id);
        res.status(201).json(facilityReview);
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const facilityReview = await FacilityReview.findByPk(req.params.id);
        if (!facilityReview) {
            return res.status(404).json({message: "Facility review not found"});
        }
        await facilityReview.update({
            rating: req.body.rating,
            comment: req.body.comment,
        }, {
            transaction: t
        });
        await t.commit();
        await updateRating(facilityReview.facility_id);
        res.status(200).json(facilityReview);
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const changeVisibility = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const facilityReview = await FacilityReview.findByPk(req.params.id);
        if (!facilityReview) {
            return res.status(404).json({message: "Facility review not found"});
        }
        await facilityReview.update({
            visible: req.body.visible
        }, {
            transaction: t
        });
        await t.commit();
        res.status(200).json(facilityReview);
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const destroy = async (req, res) => {
    try {
        const facilityReview = await FacilityReview.findByPk(req.params.id);
        if (!facilityReview) {
            return res.status(404).json({message: "Facility review not found"});
        }
        await facilityReview.destroy();
        await updateRating(facilityReview.facility_id);
        res.status(200).json({message: "Facility review deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    create,
    update,
    getAll,
    changeVisibility,
    destroy,
}