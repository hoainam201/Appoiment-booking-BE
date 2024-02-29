const healthFacilityController = require("../controllers/HealthFacilityController");
const express = require("express");
const router = express.Router();

router.post("/create", healthFacilityController.createHealthFacility);
router.post("/find-health-facility", healthFacilityController.getHealthFacility);
router.post("/login", healthFacilityController.login);
router.get("/find-health-facility-by-token", healthFacilityController.getHealthFacilityByToken);
router.get("/find-health-facility-by-id", healthFacilityController.getHealthFacilityById);
router.put("/update-health-facility", healthFacilityController.updateHealthFacility);

module.exports = router;