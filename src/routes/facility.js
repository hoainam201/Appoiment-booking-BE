const healthFacilityController = require("../controllers/HealthFacilityController");
const express = require("express");
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');
const checkStaff = require("../middlewares/checkStaff");
const {staffRole} = require("../utils/constants");
router.post('/cloudinary-upload', fileUploader.single('file'), (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  res.json({ secure_url: req.file.path });
});

router.post("/create", fileUploader.single('file'), healthFacilityController.create);
router.post("/find-health-facility", healthFacilityController.getHealthFacility);
router.get("/get-by-id/:id",healthFacilityController.getById);
router.get("/get-by-admin/:id", checkStaff(staffRole.ADMIN), healthFacilityController.getByAdmin);
router.get("/get-by-token", checkStaff(staffRole.MANAGER), healthFacilityController.getByToken);
router.get("/get-all", healthFacilityController.getAllNotPaged);
// router.patch("/inactive/:id", checkStaff(staffRole.MANAGER), healthFacilityController.inactive);
router.put("/update", checkStaff(staffRole.MANAGER), fileUploader.single('file'), healthFacilityController.update);
router.post("/search", healthFacilityController.search);
router.get("/top-health-facilities", healthFacilityController.getTopHealthFacilities);
router.get("/", healthFacilityController.getAll);

module.exports = router;