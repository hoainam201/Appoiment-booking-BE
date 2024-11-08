const HealthService = require("../models/HealthService");
const {serviceType, bookingStatus} = require("../utils/constants");
const sequelize = require("../configs/db.config");
const Booking = require("../models/Booking");
const HealthFacility = require("../models/HealthFacility");
const {QueryTypes} = require('sequelize');
const {Op} = require("sequelize");
const ServiceReview = require("../models/ServiceReview");
const _ = require('lodash');

const getAllDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const maxPage = Math.ceil((await HealthService.count()) / 20) - 1;
    if (page > maxPage) {
      return res.status(404).json({message: "Page not found"});
    }
    const doctors = await HealthService.findAndCountAll({
      offset: (page - 1) * 20,
      limit: 20,
      where: {
        type: serviceType.DOCTOR,
      }
    });
    res.status(200).json({
      doctor: doctors.rows,
      maxPage: maxPage
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const getAllPackages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const maxPage = Math.ceil((await HealthService.count()) / 20) - 1;
    if (page > maxPage) {
      return res.status(404).json({message: "Page not found"});
    }
    const packages = await HealthService.findAndCountAll({
      offset: (page - 1) * 20,
      limit: 20,
      where: {
        type: serviceType.PACKAGE,
      },
      order: [['created_at', 'DESC']],
    });
    res.status(200).json({
      packages: packages,
      maxPage: maxPage
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const search = async (req, res) => {
  try {
    const name = req.body.name ? req.body.name : null;
    const type = req.body.type;
    const speciality = req.body.speciality ? req.body.speciality : null;
    const page = parseInt(req.body.page) || 1;
    const maxPage = Math.ceil((await HealthService.count()) / 20) - 1;
    const sort = req.body.sort ? req.body.sort : '1';
    if (page > maxPage) {
      return res.status(404).json({message: "Page not found"});
    }
    const query = {};
    let order = ['created_at','ASC'];
    switch (sort) {
      case '1':
        order = ['created_at','DESC'];
        break;
      case '2':
        order = ['created_at','ASC'];
        break;
      case '3':
        order = ['avg_rating','ASC'];
        break;
      case '4':
        order = ['avg_rating','DESC'];
        break;
      case '5':
        order = ['fee','ASC'];
        break;
      case '6':
        order = ['fee','DESC'];
        break;
      default:
        order = ['created_at','DESC'];
        break;
    }
    query.active = {
      [Op.eq]: true
    }
    if (name) {
      query.name = {
        [Op.iLike]: `%${name}%`
      }
    }
    if (type !== null && type !== undefined) {
      query.type = {
        [Op.eq]: type
      }
    }
    if (speciality) {
      query.speciality = {
        [Op.eq]: speciality
      }
    }
    const services = await HealthService.findAndCountAll({
      offset: (page - 1) * 20,
      limit: 20,
      where: query,
      order: [order],
    });
    res.status(200).json({
      services: services.rows,
      maxPage: Math.ceil(services.count / 20),
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
    const avg_rating = 0;
    const charge_of = req.body.chargeOf;
    const created_by = req.staff.email;
    const updated_by = req.staff.email;
    const exit = await HealthService.findOne({
      where: {
        charge_of: charge_of,
        type: serviceType.DOCTOR
      }
    });
    if (exit) {
      return res.status(400).json({message: "Dịch vụ y tế đã tồn tại"});
    }
    await HealthService.create({
      name: name,
      type: type,
      speciality: speciality,
      description: description,
      image: req.file ? req.file.path : null,
      facility_id: req.staff.facility_id,
      fee: fee,
      charge_of: charge_of,
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
  const bookingCount = await Booking.count({
    where: {
      service_id: id
    }
  });
  service.dataValues.booking_count = bookingCount;
  const completedBookingCount = await Booking.count({
    where: {
      service_id: id,
      status: bookingStatus.COMPLETED,
    }
  });
  const facility = await HealthFacility.findOne({
    where: {
      id: service.facility_id
    }
  });
  service.dataValues.facility = facility;
  service.dataValues.completed_booking_count = completedBookingCount;
  res.status(200).json(service);
}

const update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const service = await HealthService.findOne({
      where: {
        id: id
      }
    });
    if (!service) {
      return res.status(404).json({message: "Health service not found"});
    }
    service.charge_of = req.body.chargeOf ? req.body.chargeOf : service.charge_of;
    service.name = req.body.name ? req.body.name : service.name;
    service.type = req.body.type ? req.body.type : service.type;
    if (req.file) {
      service.image = req.file.path;
    }
    service.speciality = req.body.speciality ? req.body.speciality : service.speciality;
    service.description = req.body.description ? req.body.description : service.description;
    service.fee = req.body.fee ? req.body.fee : service.fee;
    service.active = req.body.active ? req.body.active : service.active;
    service.updated_by = req.staff.email;
    service.updated_at = new Date();
    await service.save({transaction: t});
    await t.commit();
    res.status(200).json({message: "Health service updated"});
  } catch (error) {
    await t.rollback();
    res.status(500).json({message: error.message});
  }
}

const getAllByToken = async (req, res) => {
  try {
    const id = req.staff.facility_id;
    let querysql = "SELECT h.*, count(s.service_id) as review_count FROM health_services h " +
      "LEFT JOIN service_reviews s ON h.id = s.service_id " + `WHERE h.facility_id = ${id} ` +
      "GROUP BY h.id";
    const services = await sequelize.query(querysql, {
      type: QueryTypes.SELECT
    });
    if (!services) {
      return res.status(404).json({message: "Health service not found"});
    }
    console.log(services);
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const getAllByFacility = async (req, res) => {
  try {
    const id = req.params.id;
    const services = await HealthService.findAll({
      where: {
        facility_id: id,
        active: true
      }
    });
    if (!services) {
      return res.status(404).json({message: "Health service not found"});
    }
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const changeStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const service = await HealthService.findByPk(id);
    if (!service) {
      return res.status(404).json({message: "Health service not found"});
    }
    service.active = !service.active;
    service.updated_by = req.staff.email;
    service.updated_at = new Date();
    await service.save({transaction: t});
    await t.commit();
    res.status(200).json({message: "Health service updated"});
  } catch (error) {
    await t.rollback();
    res.status(500).json({message: error.message});
  }
}


const getCollaborativeFilteringRecommendations = async (req, res) => {
  const serviceType = req.params.type;
  const userId = req.user.id;
  const bookings = await Booking.findAll();

  // Tạo một ma trận booking
  const userBookings = {};
  bookings.forEach((booking) => {
    if (!userBookings[booking.user_id]) {
      userBookings[booking.user_id] = {};
    }
    userBookings[booking.user_id][booking.service_id] = true;
  });

  // Lấy các dịch vụ theo loại
  const services = await HealthService.findAll({
    where: {
      type: serviceType,
    },
  });

  // Tính toán điểm tương đồng giữa các người dùng
  const userSimilarity = {};
  Object.keys(userBookings).forEach((user) => {
    userSimilarity[user] = {};
    Object.keys(userBookings).forEach((otherUser) => {
      if (user !== otherUser) {
        const commonBookings = Object.keys(userBookings[user]).filter(
          (serviceId) => userBookings[otherUser][serviceId]
        );

        userSimilarity[user][otherUser] = commonBookings.length;
      }
    });
  });

  // Lấy các dịch vụ chưa được đặt bởi người dùng
  let servicesToRecommend = services
    .filter(
      (service) =>
        !userBookings[userId] || !userBookings[userId][service.id]
    )
    .map((service) => {
      const totalSimilarity = Object.keys(userSimilarity[userId] || {})
        .map((otherUserId) => ({
          similarity: userSimilarity[userId][otherUserId],
          hasBooked: userBookings[otherUserId] && userBookings[otherUserId][service.id],
        }))
        .filter((pair) => pair.hasBooked)
        .reduce(
          (total, pair) => ({
            totalSim: total.totalSim + pair.similarity,
            totalBooking: total.totalBooking + pair.similarity,
          }),
          { totalSim: 0, totalBooking: 0 }
        );

      return {
        serviceId: service.id,
        predictedInterest:
          totalSimilarity.totalSim !== 0
            ? totalSimilarity.totalBooking / totalSimilarity.totalSim
            : 0,
      };
    })
    .sort((a, b) => b.predictedInterest - a.predictedInterest);

  if (servicesToRecommend.length === 0) {
    servicesToRecommend = services
      .map((service) => ({
        serviceId: service.id,
        predictedInterest: 0, // hoặc giá trị mặc định khác nếu cần
      }))
      .sort(() => 0.5 - Math.random()) // sắp xếp ngẫu nhiên
      .slice(0, 5); // Lấy 5 dịch vụ đầu tiên
  }

  // return res.status(200).json(servicesToRecommend);
  const servicesC = await HealthService.findAll({
    where: {
      id: {
        [Op.in]: servicesToRecommend.slice(0, 5).map((service) => service.serviceId)
      }
    }
  });
  return res.status(200).json(servicesC);
};

const getTopDoctors = async (req, res) => {
  try {
    const top = await HealthService.findAll({
      where: {
        active: true,
        type: serviceType.DOCTOR
      },
      order: [['avg_rating', 'DESC']],
      limit: 5
    });
    return res.status(200).json(top);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}

const getTopPackages = async (req, res) => {
  try {
    const top = await HealthService.findAll({
      where: {
        active: true,
        type: serviceType.PACKAGE
      },
      order: [['avg_rating', 'DESC']],
      limit: 5
    });
    return res.status(200).json(top);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}

module.exports = {
  getAllDoctors,
  getAllPackages,
  create,
  update,
  findById,
  getAllByToken,
  getAllByFacility,
  search,
  changeStatus,
  getCollaborativeFilteringRecommendations,
  getTopDoctors,
  getTopPackages
}