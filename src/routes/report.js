const reportController = require("../controllers/ReportController");
const express = require("express");
const router = express.Router();
const checkUser = require("../middlewares/checkUser");
const checkStaff = require("../middlewares/checkStaff");
const {staffRole} = require("../utils/constants");

router.get("/get-report", reportController.getDailyBookings);
router.get("/get-report-facility", reportController.facility);
router.get("/get-report-total", reportController.total);
module.exports = router