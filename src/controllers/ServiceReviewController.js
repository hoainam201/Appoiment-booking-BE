const ServiceReview = require("../models/ServiceReview");
const {newsStatus, bookingStatus} = require("../utils/constants");
const Booking = require("../models/Booking");
const HealthService = require("../models/HealthService");
const db = require("../configs/db.config");

const create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const rating = req.body.rating;
        const service_id = req.body.service_id;
        const user_id = req.user.id;
        const booking_id = req.body.booking_id ? req.body.booking_id : null;
        const comment = req.body.comment ? req.body.comment : null;
        if(!booking_id) {
            return res.status(404).json({message: "Id không tồn tại"})
        }
        const booking = await Booking.findByPk(
            booking_id
        );
        if (!booking ||booking.service_id !== service_id) {
            return res.status(404).json({message: "Id không tồn tại"});
        }
        if (booking.user_id !== user_id) {
            return res.status(404).json({message: "Bạn không có quyền tạo đánh giá này"});
        }
        if(booking.status !== bookingStatus.COMPLETED) {
            return res.status(404).json({message: "Bạn chưa hoàn thành lịch khám"});
        }
        const serviceReview = await ServiceReview.create({
            rating: rating,
            service_id: service_id,
            user_id: user_id,
            booking_id: booking_id,
            visible: newsStatus.SHOW,
            comment: comment
        }, {
            transaction: t
        });
        const query = `SELECT AVG(rating) as rating FROM service_reviews WHERE service_id = ${service_id}`;
        const data = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
        const avg = (data[0].rating * 10) / 10;
        await HealthService.update({rating: avg}, {where: {id: service_id}});
        await t.commit();
        res.status(201).json(serviceReview);
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

const update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        if(!req.params.id) {
            return res.status(404).json({message: "Id không tồn tại"})
        }
        const serviceReview = await ServiceReview.findByPk(req.params.id);
        if (!serviceReview) {
            return res.status(404).json({message: "Không tìm thấy review hợp lệ"});
        }
        await serviceReview.update({
            rating: req.body.rating,
            comment: req.body.comment,
        }, {
            transaction: t
        });
        const query = `SELECT AVG(rating) as rating FROM service_reviews WHERE service_id = ${serviceReview.service_id}`;
        const data = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
        const rating = (data[0].rating * 10) / 10;
        await t.commit();
        res.status(200).json(serviceReview);
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    create,
    update
}