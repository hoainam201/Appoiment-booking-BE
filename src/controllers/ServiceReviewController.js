const ServiceReview = require("../models/ServiceReview");
const {newsStatus, bookingStatus} = require("../utils/constants");
const Booking = require("../models/Booking");
const HealthService = require("../models/HealthService");
const sequelize = require("../configs/db.config");

const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const rating = req.body.rating;
    const service_id = req.body.service_id;
    const user_id = req.user.id;
    const booking_id = req.body.booking_id ? req.body.booking_id : null;
    const comment = req.body.comment ? req.body.comment : null;
    if (!booking_id) {
      return res.status(404).json({message: "Id không tồn tại"})
    }
    const booking = await Booking.findByPk(
      booking_id
    );
    if (!booking || booking.service_id !== service_id) {
      return res.status(404).json({message: "Id không tồn tại"});
    }
    if (booking.user_id !== user_id) {
      return res.status(404).json({message: "Bạn không có quyền tạo đánh giá này"});
    }
    if (booking.status !== bookingStatus.COMPLETED) {
      return res.status(404).json({message: "Bạn chưa hoàn thành lịch khám"});
    }
    const exist = await ServiceReview.findOne({
      where: {
        booking_id: booking_id,
        user_id: user_id,
      }
    });
    if (exist) {
      return res.status(404).json({message: "Đánh giá đã tồn tại"});
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
    await Notification.create({
      content: `Đánh giá ${booking.user_name} cho ${booking.service_name}`,
      facility_id: booking.facility_id,
      status: notificationStatus.UNREAD,
      created_at: new Date(),
      updated_at: new Date()
    });
    booking.service_review_id = serviceReview.id;
    await booking.save({transaction: t});
    const query = `SELECT AVG(rating) as rating
                   FROM service_reviews
                   WHERE service_id = ${service_id}`;
    await t.commit();
    const data = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
    const avg = (data[0].rating * 10) / 10;
    const service = await HealthService.findByPk(service_id);
    service.avg_rating = avg;
    await service.save();
    res.status(201).json(serviceReview);
  } catch (error) {
    await t.rollback();
    res.status(500).json({message: error.message});
  }
}

const get = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({message: "Id không tồn tại"})
  }
  const serviceReview = await ServiceReview.findByPk(id);
  if (!serviceReview) {
    return res.status(404).json({message: "Không tìm thấy review hợp lệ"});
  }
  res.status(200).json(serviceReview);
}

const update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (!req.params.id) {
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
    const query = `SELECT AVG(rating) as rating
                   FROM service_reviews
                   WHERE service_id = ${serviceReview.service_id}`;
    const data = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
    const rating = (data[0].rating * 10) / 10;
    await t.commit();
    res.status(200).json(serviceReview);
  } catch (error) {
    await t.rollback();
    res.status(500).json({message: error.message});
  }
}

const getAllByService = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({message: "Id không tồn tại"})
  }
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const query = `SELECT s.id, s.rating, s.comment, s.created_at, users.name
                 FROM service_reviews s
                          LEFT JOIN users ON s.user_id = users.id
                 WHERE service_id = ${id} LIMIT 10
                 OFFSET ${offset}`;
  const reviews = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  const total = await ServiceReview.count({where: {service_id: req.params.id}});
  res.status(200).json({reviews: reviews, total: total});
}

const getAllByFacility = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({message: "Id không tồn tại"})
  }
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const query = `SELECT s.id, s.rating, s.comment, s.created_at, users.name
                 FROM service_reviews s
                          LEFT JOIN users ON s.user_id = users.id
                 WHERE service_id in (select id from health_services where facility_id = ${id})
                     limit 10
                 offset ${offset}`;
  const reviews = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  const total = await sequelize.query(`select count(*) from service_reviews r join health_services h
on r.service_id = h.id where facility_id = ${id}`, {type: sequelize.QueryTypes.SELECT});
  res.status(200).json({reviews: reviews, total: total[0].count});
}

module.exports = {
  create,
  update,
  getAllByService,
  get,
  getAllByFacility
}