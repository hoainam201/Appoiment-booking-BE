const {Op} = require('sequelize');
const Booking = require('../models/Booking');
const HealthFacility = require('../models/HealthFacility');
const User = require('../models/User');
const HealthService = require('../models/HealthService');
const ServiceReview = require('../models/ServiceReview');
const {addDays, differenceInDays} = require('date-fns');

const getDailyBookings = async (req, res) => {
  try {
    const startDate = req.query.start;
    const endDate = req.query.end; // Giả sử bạn gửi dữ liệu qua body

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysInRange = differenceInDays(end, start) + 1;

    const bookingCounts = await Promise.all(
      Array.from({length: daysInRange}, async (_, i) => {
        const currentDay = addDays(start, i);
        const startOfDay = new Date(currentDay.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDay.setHours(23, 59, 59, 999));

        const count = await Booking.count({
          where: {
            time: {
              [Op.between]: [startOfDay, endOfDay]
            }
          }
        });

        return {day: currentDay.getDate(), count};
      })
    );

    res.status(200).json(bookingCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error.message});
  }
};

const facility = async (req, res) => {
  try {
    const types = [
      {id: 0, label: 'Bệnh viện'},
      {id: 1, label: 'Phòng khám'},
      {id: 2, label: 'Trạm y tế'}
    ];

    const typeCounts = await Promise.all(types.map(async (type) => {
      const count = await HealthFacility.count({
        where: {
          type: type.id
        }
      });
      return {
        id: type.id,
        value: count,
        label: type.label
      };
    }));

    res.status(200).json(typeCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error.message});
  }
}

const   total= async (req, res) => {
  try {
    const bookings = await Booking.count();
    const users = await User.count();
    const services = await HealthService.count();
    const reviews = await ServiceReview.count();
    const total = {
      bookings: bookings,
      users: users,
      services: services,
      reviews: reviews,
    };
    res.status(200).json(total);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error.message});
  }
}


module.exports = {
  getDailyBookings,
  facility,
  total
};
