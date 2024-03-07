const doctorController = require("../controllers/DoctorController");
const express = require("express");
const router = express.Router();

router.get("/", doctorController.getAllDoctor);

module.exports = router;