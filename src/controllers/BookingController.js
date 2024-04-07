const Booking = require("../models/Booking");
const {bookingStatus} = require("../utils/constants");
const sequelize = require("../configs/db.config");
const {QueryTypes, Op} = require("sequelize");
const Notification = require("../models/Notification");
const {notificationStatus} = require("../utils/constants");
const transporter = require("../configs/transporter.config");

const getBookingByUser = async (req, res) => {
    const id = req.user.id;
    const bookings = await Booking.findAll({
        where: {
            booking_user_id: id,
        }
    });
    return res.status(200).json(bookings);
};

const getBookingByDoctor = async (req, res) => {
    const id = req.staff.facility_id;
    const query = "select * from bookings where service_id in (select id from health_services where facility_id = ";
    const bookings = sequelize.query(query + id + ")", {
        type: QueryTypes.SELECT,
    })
    return res.status(200).json(bookings);
};

const getBookingByManager = async (req, res) => {
    const id = req.staff.id;
    const query = "select * from bookings where service_id in (select id from health_services where facility_id = ";
    const bookings = sequelize.query(query + id + ")", {
        type: QueryTypes.SELECT
    });
    return res.status(200).json(bookings);
};

const create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const booking = await Booking.create({
            user_id: req.user.id,
            service_id: req.body.service_id,
            booking_user_id: req.body.booking_user_id,
            booking_user_name: req.body.booking_user_name,
            booking_user_phone: req.body.booking_user_phone,
            dob: req.body.dob,
            time: req.body.time,
            status: bookingStatus.PENDING,
            charge_of: req.body.charge_of,
            created_at: new Date(),
            updated_at: new Date()
        }, {transaction: t});
        await Notification.create({
            content: "Bạn có 1 yêu cầu đặt lịch mới! từ " + req.body.booking_user_name,
            to_staff_id: req.body.charge_of,
            status: notificationStatus.UNREAD,
            created_at: new Date(),
            updated_at: new Date(),
        })
        await t.commit();
        return res.status(200).json(booking);
    } catch (error) {
        await t.rollback();
        return res.status(500).json(error);
    }
};

const accept = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;
        const booking = await Booking.findByPk(id);
        if(!booking) {
            return res.status(404).json({message: "Booking not found"});
        }
        if(booking.status !== bookingStatus.PENDING) {
            return res.status(400).json({message: "Booking not pending"});
        }
        booking.status = bookingStatus.ACCEPTED;
        booking.updated_at = new Date();
        await booking.save();
        await Notification.create({
            content: `Bạn có lịch khám khám mới từ ${booking.booking_user_name}`,
            to_staff_id: booking.charge_of,
            status: notificationStatus.UNREAD,
            created_at: new Date(),
            updated_at: new Date(),
        })
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
        if(!booking) {
            return res.status(404).json({message: "Booking not found"});
        }
        if(booking.status !== bookingStatus.PENDING) {
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
        // await transporter.sendMail(mailOptions);
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
        if(!booking) {
            return res.status(404).json({message: "Booking not found"});
        }
        if(booking.status !== bookingStatus.ACCEPTED) {
            return res.status(400).json({message: "Booking not accepted"});
        }
        let date = new Date();
        date.setHours(date.getHours() + 7); // Thêm 7 giờ để chuyển đổi sang múi giờ UTC+7

        // Tính toán thời gian 30 phút sau và chuyển đổi sang múi giờ UTC+7
        let thirtyMinutesLater = new Date(date.getTime() - (30 * 60 * 1000)); // Thêm 30 phút

        // So sánh thời gian hiện tại với thời gian 30 phút sau
        if (booking.time < thirtyMinutesLater) {
            // Thực hiện khi thời gian hiện tại nhỏ hơn thời gian 30 phút sau
            return res.status(400).json({message: "Booking not completed yet"});
        }
        booking.status = bookingStatus.COMPLETED;
        booking.updated_at = new Date();
        await booking.save();
        await t.commit();
        const mailOptions = {
            from: process.env.EMAIL,
            to: 'nam.nh194628@sis.hust.edu.vn',
            subject: "HealthPro",
            text: "Ca khám bệnh của bạn đã kết thúc",
        }
        return res.status(200).json(booking);
    } catch (error) {
        await t.rollback();
        return res.status(500).json(error);
    }
};

const cancel = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;
        const booking = await Booking.findByPk(id);
        if(!booking) {
            return res.status(404).json({message: "Booking not found"});
        }
        if(booking.status === bookingStatus.COMPLETED) {
            return res.status(400).json({message: "Booking already completed"});
        }
        booking.status = bookingStatus.CANCELLED;
        booking.updated_at = new Date();
        await booking.save();
        await Notification.create({
            content: `Lịch khám bệnh của ${booking.booking_user_name} bi huy`,
            to_staff_id: booking.charge_of,
            status: notificationStatus.UNREAD,
            created_at: new Date(),
            updated_at: new Date(),
        })
        await t.commit();
        return res.status(200).json(booking);
    } catch (error) {
        await t.rollback();
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
    complete,
    cancel,
}