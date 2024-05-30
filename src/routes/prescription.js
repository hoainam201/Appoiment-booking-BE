const prescriptionController = require("../controllers/PrescriptionController");
const express = require("express");
const router = express.Router();
const checkUser = require("../middlewares/checkUser");
const checkStaff = require("../middlewares/checkStaff");
const {staffRole} = require("../utils/constants");

router.post("/create", checkStaff(staffRole.DOCTOR), prescriptionController.create);
router.delete("/delete/:id", checkStaff(staffRole.DOCTOR), prescriptionController.destroy);
router.get("/get-by-diagnosis/:id", prescriptionController.getByDiagnosis);

module.exports = router;