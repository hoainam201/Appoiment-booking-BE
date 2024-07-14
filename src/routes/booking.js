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
router.put("/accept/:id", checkStaff(), bookingController.accept);
router.put("/reject/:id", checkStaff(), bookingController.reject);
router.put("/cancel/:id", checkUser, bookingController.cancel);
router.put("/complete/:id", checkStaff(staffRole.DOCTOR), bookingController.complete);
router.put("/start/:id", checkStaff(staffRole.DOCTOR), bookingController.start);
router.get("/details/:id", checkUser, bookingController.details);
router.get("/get-details/:id", checkStaff(), bookingController.details);
router.put("/paid/:id", checkStaff(staffRole.MANAGER), bookingController.paid);
router.get("/detail/:id", checkUser, bookingController.detailByUser);
router.put("/checkin/:id", checkStaff(staffRole.MANAGER), bookingController.checkin);

module.exports = router;