const bookingController = require("../controllers/BookingController");
const express = require("express");
const router = express.Router();
const checkUser = require("../middlewares/checkUser");
const checkStaff = require("../middlewares/checkStaff");
const {staffRole} = require("../utils/constants");

router.post("/create", checkUser, bookingController.create);
router.get("/get-booking-by-user", checkUser,bookingController.getBookingByUser);
router.get("/get-booking-by-doctor", checkStaff(staffRole.DOCTOR),bookingController.getBookingByDoctor);
router.get("/get-booking-by-manager", checkStaff(staffRole.MANAGER),bookingController.getBookingByManager);
router.put("/accept", checkStaff(), bookingController.accept);
router.put("/reject", checkStaff(), bookingController.reject);
router.put("/cancel", checkUser, bookingController.cancel);
router.put("/complete", checkStaff(staffRole.DOCTOR), bookingController.complete);

module.exports = router;