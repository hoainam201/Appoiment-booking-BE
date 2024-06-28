const sequelize= require('../configs/db.config');
const schedule = require('node-schedule');
const Booking = require('../models/Booking');
const {Op} = require('sequelize');
const User = require('../models/User');
const transporter = require('../configs/transporter.config');
const {formatInTimeZone} = require("date-fns-tz");
require('dotenv').config();

// Hàm cập nhật avg_rating
const updateAvgRating = async () => {
  try {
    await sequelize.query(`
      UPDATE health_facilities hf
      SET avg_rating = subquery.avg_rating
      FROM (
        SELECT facility_id, AVG(avg_rating) as avg_rating
        FROM health_services
        WHERE active = true and avg_rating != 0
        GROUP BY facility_id
      ) AS subquery
      WHERE hf.id = subquery.facility_id;
    `);
    console.log('Average ratings updated successfully.');
  } catch (error) {
    console.error('Error updating average ratings:', error);
  }
};

const updateBookingStatus = async () => {
  try {
    await sequelize.query(`
      UPDATE bookings
      SET status = 4
      WHERE status NOT IN (3, 5)
      AND time < current_timestamp;
    `);
    console.log('Booking statuses updated successfully.');
  } catch (error) {
    console.error('Error updating booking statuses:', error);
  }
};

const sendEmail = async () => {
  try {
    // Thiết lập thời gian bắt đầu của ngày hiện tại
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Thiết lập thời gian kết thúc của ngày hiện tại
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const bookings = await Booking.findAll({
      where: {
        status: 1,
        time: {
          [Op.between]: [startOfToday, endOfToday]
        }
      }
    });

    if (bookings.length > 0) {
      bookings.forEach(async (booking) => {
        try {
          const user = await User.findByPk(booking.user_id);
          if (user) {
            const email = user.email;
            const name = booking.name;
            const time = booking.time;

            const mailOptions = {
              from: process.env.EMAIL,
              to: email,
              subject: 'Nhắc nhở lịch hẹn',
              text: `Kính gửi ${name},\n\nĐây là lời nhắc về đặt chỗ của bạn vào hôm nay lúc ${formatInTimeZone(time, "Asia/Ho_Chi_Minh", "HH:mm yyyy-MM-dd")}.\n\nTrân trọng,\nHealth Pro`
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.error('Error sending email:', error);
              }
              console.log('Email sent: ' + info.response);
            });
          }
        } catch (err) {
          console.error('Error fetching user or sending email:', err);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// Lên lịch chạy hàm mỗi ngày lúc 17:00 UTC+7
const scheduleUpdate = () => {
  // Tính toán thời gian chạy theo UTC+7
  const rule = new schedule.RecurrenceRule();
  rule.tz = 'Asia/Bangkok'; // Sử dụng múi giờ UTC+7
  rule.hour = 18;
  rule.minute = 0;
  rule.second = 0;

  schedule.scheduleJob(rule, () => {
    console.log('Running scheduled task...');
    updateAvgRating();
    updateBookingStatus();
  });
};

const scheduleEmail = () => {
  const rule = new schedule.RecurrenceRule();
  rule.tz = 'Asia/Bangkok';
  rule.hour = 7;
  rule.minute = 0;
  rule.second = 0;

  schedule.scheduleJob(rule, () => {
    console.log('Running email task...');
    sendEmail();
  });
};

// Gọi hàm để lên lịch
scheduleUpdate();

module.exports = {
  scheduleUpdate,
  scheduleEmail
}