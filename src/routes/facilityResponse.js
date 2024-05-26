const FacilityResponseController = require("../controllers/FacilityResponeController");
const express = require("express");
const router = express.Router();

router.get("/get-all", FacilityResponseController.getAll);
module.exports = router;