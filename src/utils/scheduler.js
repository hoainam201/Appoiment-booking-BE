const { sequelize } = require('../configs/db.config');
const schedule = require('node-schedule');

// Hàm cập nhật avg_rating
const updateAvgRating = async () => {
  try {
    await sequelize.query(`
      UPDATE health_facilities hf
      SET avg_rating = subquery.avg_rating
      FROM (
        SELECT facility_id, AVG(avg_rating) as avg_rating
        FROM health_services
        WHERE active = true
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
      AND DATE(time) = CURRENT_DATE;
    `);
    console.log('Booking statuses updated successfully.');
  } catch (error) {
    console.error('Error updating booking statuses:', error);
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

// Gọi hàm để lên lịch
scheduleUpdate();

module.exports = {
  scheduleUpdate
}