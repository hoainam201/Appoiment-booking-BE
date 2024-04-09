const healthFacilityController = require("../controllers/HealthFacilityController");
const express = require("express");
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');

router.post('/cloudinary-upload', fileUploader.single('file'), (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  res.json({ secure_url: req.file.path });
});

router.post("/create", fileUploader.single('file'), healthFacilityController.create);
router.post("/find-health-facility", healthFacilityController.getHealthFacility);
router.get("/:id", healthFacilityController.getById);
router.put("/update-health-facility", healthFacilityController.update);
router.get("/", healthFacilityController.getAll);

module.exports = router;