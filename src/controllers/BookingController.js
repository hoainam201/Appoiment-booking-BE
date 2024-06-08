const Booking = require("../models/Booking");
const {bookingStatus, serviceType} = require("../utils/constants");
const sequelize = require("../configs/db.config");
const {QueryTypes, Op} = require("sequelize");
const Notification = require("../models/Notification");
const {notificationStatus} = require("../utils/constants");
const transporter = require("../configs/transporter.config");
const HealthService = require("../models/HealthService");
const Diagnosis = require("../models/Diagnosis");
const Prescription = require("../models/Prescription");

const getBookingByUser = async (req, res) => {
  try {

    const id = req.user.id;
    const query = `select bookings.*, health_services.name as service_name
                   from bookings
                            join health_services on bookings.service_id = health_services.id
                   where user_id = ${id}
                   order by updated_at desc;`;
    const bookings = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
};

const getBookingByDoctor = async (req, res) => {
  try {
    const charge_of = req.staff.email;
    const speciality = req.staff.speciality;
    const query = `select b.*, h.name as service_name
                   from bookings b
                            join health_services h on b.service_id = h.id
                   where (b.charge_of = ? or
                          (h.speciality = ? and h.type = 1))
                     and ((b.status = 1 and b.time >= current_date and b.time < current_date + 7)
                       or b.status = 5)
                   order by (b.time - current_timestamp) asc;`;
    const bookings = await sequelize.query(query, {
      replacements: [charge_of, speciality],
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
};

const getBookingByManager = async (req, res) => {
  try {
    const id = req.staff.facility_id;
    const query = `select bookings.*, health_services.name as service_name
                   from bookings
                            join health_services on bookings.service_id = health_services.id
                   where service_id in (select id from health_services where facility_id = ${id})
                   order by id desc;`;
    const bookings = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json(error);
  }
};

const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (!req.body.service_id || !req.body.name || !req.body.phone || !req.body.dob || !req.body.time) {
      return res.status(400).json({message: "Yêu cầu điền đầy đủ thông tin!"});
    }
    const service = await HealthService.findByPk(req.body.service_id);
    const booking = await Booking.create({
      user_id: req.user.id,
      service_id: req.body.service_id,
      name: req.body.name,
      phone: req.body.phone,
      dob: req.body.dob,
      time: req.body.time,
      status: bookingStatus.PENDING,
      charge_of: service.type === serviceType.DOCTOR ? service.charge_of : null,
      created_at: new Date(),
      updated_at: new Date()
    }, {transaction: t});
    await Notification.create({
      content: `Yêu cầu ${req.body.name} đặt lịch ${service.name}`,
      facility_id: service.facility_id,
      status: notificationStatus.UNREAD,
      created_at: new Date(),
      updated_at: new Date()
    })
    await t.commit();
    return res.status(200).json(booking);
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).json(error);
  }
};

const accept = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({message: "Booking not found"});
    }
    if (booking.status !== bookingStatus.PENDING) {
      return res.status(400).json({message: "Booking not pending"});
    }
    booking.status = bookingStatus.ACCEPTED;
    booking.updated_at = new Date();
    await booking.save();
    await t.commit();
    return res.status(200).json(booking);
  } catch (error) {
    await t.rollback();
    return res.status(500).json(error);
  }
};

const reject = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({message: "Booking not found"});
    }
    if (booking.status !== bookingStatus.PENDING) {
      return res.status(400).json({message: "Booking already rejected"});
    }
    booking.status = bookingStatus.REJECTED;
    booking.updated_at = new Date();
    await booking.save();
    await t.commit();
    const mailOptions = {
      from: process.env.EMAIL,
      to: 'nam.nh194628@sis.hust.edu.vn',
      subject: "HealthPro",
      text: "Yêu cầu khám của bạn đã bị từ chối!",
    }
    await transporter.sendMail(mailOptions);
    return res.status(200).json(booking);
  } catch (error) {
    await t.rollback();
    return res.status(500).json(error);
  }
};

const complete = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({message: "Booking not found"});
    }
    if (booking.status !== bookingStatus.STARTED) {
      return res.status(400).json({message: "Booking not started yet"});
    }
    let date = new Date();
    booking.status = bookingStatus.COMPLETED;
    booking.charge_of = req.staff.email;
    booking.completed_at = date;
    booking.updated_at = new Date();
    await booking.save();
    await t.commit();
    return res.status(200).json(booking);
  } catch (error) {
    await t.rollback();
    return res.status(500).json(error);
  }
};

const start = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({message: "Booking not found"});
    }
    if (booking.status !== bookingStatus.ACCEPTED) {
      return res.status(400).json({message: "Booking not accepted"});
    }
    booking.status = bookingStatus.STARTED;
    booking.updated_at = new Date();
    const diagnosis = await Diagnosis.create({
      booking_id: booking.id,
      description: "",
      created_at: new Date(),
      updated_at: new Date(),
    }, {transaction: t});
    await t.commit();
    booking.started_at = new Date();
    booking.diagnosis_id = diagnosis.id;
    await booking.save();
    return res.status(200).json(booking);
  } catch (error) {
    await t.rollback();
    return res.status(500).json(error);
  }
}


const cancel = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({message: "Booking not found"});
    }
    if (booking.status === bookingStatus.COMPLETED || booking.status === bookingStatus.CANCELLED || booking.status === bookingStatus.REJECTED || booking.status === bookingStatus.STARTED) {
      return res.status(400).json({message: "Booking already completed"});
    }
    booking.status = bookingStatus.CANCELLED;
    booking.updated_at = new Date();
    await booking.save();
    // await Notification.create({
    //     content: `Lịch khám bệnh của ${booking.booking_user_name} bi huy`,
    //     to_staff_id: booking.charge_of,
    //     status: notificationStatus.UNREAD,
    //     created_at: new Date(),
    //     updated_at: new Date(),
    // })
    await t.commit();
    return res.status(200).json(booking);
  } catch (error) {
    await t.rollback();
    return res.status(500).json(error);
  }
}

const details = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findOne({
      where: {
        id: id
      }
    });
    if (!booking) {
      return res.status(404).json({message: "Booking not found"});
    }
    const service = await HealthService.findOne({
      where: {
        id: booking.service_id
      }
    });
    booking.dataValues.service = service;
    const diagnosis = await Diagnosis.findOne({
      where: {
        booking_id: booking.id
      }
    });
    booking.dataValues.diagnosis = diagnosis;
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const detailByUser = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findOne({
      where: {
        id: id,
        user_id: req.user.id
      }
    });
    if (!booking) {
      return res.status(404).json({message: "Booking not found"});
    }
    const service = await HealthService.findOne({
      where: {
        id: booking.service_id
      }
    });
    booking.dataValues.service = service;
    const diagnosis = await Diagnosis.findOne({
      where: {
        booking_id: booking.id
      }
    });
    booking.dataValues.diagnosis = diagnosis;
    const prescription = await Prescription.findAll({
      where: {
        diagnosis_id: booking.diagnosis_id
      }
    });
    booking.dataValues.prescription = prescription;
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const paid = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findOne({
      where: {
        id: id
      }
    });
    if (!booking) {
      return res.status(404).json({message: "Booking not found"});
    }
    booking.payment_status = 1;
    booking.payment_at = new Date();
    booking.updated_at = new Date();
    await booking.save();
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  getBookingByManager,
  getBookingByUser,
  getBookingByDoctor,
  create,
  accept,
  reject,
  start,
  complete,
  cancel,
  details,
  paid,
  detailByUser
}