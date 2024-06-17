const ServiceReview = require("../models/ServiceReview");
const {newsStatus, bookingStatus} = require("../utils/constants");
const Booking = require("../models/Booking");
const HealthService = require("../models/HealthService");
const sequelize = require("../configs/db.config");
const Notification = require("../models/Notification");
const {Op, fn, col} = require("sequelize");

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
  const query = `SELECT s.id, s.rating, s.comment, s.created_at, u.name, COUNT(f.service_review_id) AS favourites_count
                 FROM service_reviews s
                          LEFT JOIN users u ON s.user_id = u.id
                          LEFT JOIN favourites f ON s.id = f.service_review_id
                 WHERE s.service_id = ${id}
                 GROUP BY s.id, s.rating, s.comment, s.created_at, u.name LIMIT 10
                 OFFSET ${offset};`;
  const reviews = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  const total = await ServiceReview.count({where: {service_id: req.params.id}});
  res.status(200).json({reviews: reviews, total: total});
}

const getAllByUser = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({message: "Id không tồn tại"})
  }
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const user_id = req.user.id
  const query = `SELECT s.id,
                        s.rating,
                        s.comment,
                        s.created_at,
                        u.name,
                        COUNT(f.service_review_id) AS favourites_count,
                        CASE
                            WHEN EXISTS (SELECT 1
                                         FROM favourites f2
                                         WHERE f2.service_review_id = s.id
                                           AND f2.user_id = ${user_id}) THEN true
                            ELSE false
                            END                    AS is_favourited
                 FROM service_reviews s
                          LEFT JOIN
                      users u ON s.user_id = u.id
                          LEFT JOIN
                      favourites f ON s.id = f.service_review_id
                 WHERE s.service_id = ${id}
                 GROUP BY s.id, s.rating, s.comment, s.created_at, u.name LIMIT 10
                 OFFSET ${offset};`;
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
  const query = `SELECT s.id, s.rating, s.comment, s.created_at, u.name, COUNT(f.service_review_id) AS favourites_count
                 FROM service_reviews s
                          LEFT JOIN users u ON s.user_id = u.id
                          LEFT JOIN favourites f ON s.id = f.service_review_id
                 WHERE s.service_id in (select id from health_services where facility_id = ${id})
                 GROUP BY s.id, s.rating, s.comment, s.created_at, u.name LIMIT 10
                 OFFSET ${offset};`;
  const reviews = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  const total = await sequelize.query(`select count(*)
                                       from service_reviews r
                                                join health_services h
                                                     on r.service_id = h.id
                                       where facility_id = ${id}`, {type: sequelize.QueryTypes.SELECT});
  res.status(200).json({reviews: reviews, total: total[0].count});
}
const getAllByFacilityAndUser = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({message: "Id không tồn tại"})
  }
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const user_id = req.user.id
  const query = `SELECT s.id,
                        s.rating,
                        s.comment,
                        s.created_at,
                        u.name,
                        COUNT(f.service_review_id) AS favourites_count,
                        CASE
                            WHEN EXISTS (SELECT 1
                                         FROM favourites f2
                                         WHERE f2.service_review_id = s.id
                                           AND f2.user_id = ${user_id}) THEN true
                            ELSE false
                            END                    AS is_favourited
                 FROM service_reviews s
                          LEFT JOIN
                      users u ON s.user_id = u.id
                          LEFT JOIN
                      favourites f ON s.id = f.service_review_id
                 WHERE s.service_id in (select id from health_services where facility_id = ${id})
                 GROUP BY s.id, s.rating, s.comment, s.created_at, u.name LIMIT 10
                 OFFSET ${offset};`;
  const reviews = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  const total = await sequelize.query(`select count(*)
                                       from service_reviews r
                                                join health_services h
                                                     on r.service_id = h.id
                                       where facility_id = ${id}`, {type: sequelize.QueryTypes.SELECT});
  res.status(200).json({reviews: reviews, total: total[0].count});
}

const ratingByService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const allRatings = [1, 2, 3, 4, 5];

    // Lấy các mốc rating và số lượng đánh giá tương ứng từ cơ sở dữ liệu
    const ratingCounts = await ServiceReview.findAll({
      attributes: [
        'rating',
        [fn('COUNT', col('*')), 'count']
      ],
      where: {
        service_id: serviceId,
        rating: {
          [Op.between]: [1, 5]
        }
      },
      group: ['rating'],
      raw: true
    });

    const totalReviews = await ServiceReview.count({where: {service_id: serviceId}});

    // Tạo một đối tượng để lưu trữ số lượng rating cho từng mốc
    const ratingMap = {};
    ratingCounts.forEach(item => {
      ratingMap[item.rating] = item.count;
    });

    // Tạo mảng kết quả cuối cùng, đảm bảo bao gồm cả các mốc chưa có
    const normalizedRatingCounts = allRatings.map(rating => ({
      rating: rating,
      count: ratingMap[rating] || 0,
      percent: totalReviews > 0 ? ((ratingMap[rating] || 0) / totalReviews) * 100 : 0
    }));

    res.status(200).json(normalizedRatingCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  }
}


module.exports = {
  create,
  update,
  getAllByService,
  get,
  getAllByFacility,
  getAllByFacilityAndUser,
  getAllByUser,
  ratingByService
}