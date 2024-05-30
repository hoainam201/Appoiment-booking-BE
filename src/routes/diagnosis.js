const diagnosisController = require("../controllers/DiagnosisController");
const express = require("express");
const router = express.Router();
const checkUser = require("../middlewares/checkUser");
const checkStaff = require("../middlewares/checkStaff");
const {staffRole} = require("../utils/constants");

router.put("/update/:id", checkStaff(staffRole.DOCTOR), diagnosisController.update);

module.exports = router;