const Booking = require("../models/Booking");
const {bookingStatus} = require("../utils/constants");

const getBookingByUser = async (req, res) => {
    const id = req.user.id;
    const bookings = await Booking.findAll({
        where: {
            booking_user_id: id,
        }
    });
    return res.status(200).json(bookings);
}

const