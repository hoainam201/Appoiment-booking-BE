const facilityStaffController = require("../controllers/FacilityStaffController");
const express = require("express");
const router = express.Router();
const checkStaff = require("../middlewares/checkStaff");
const fileUploader = require('../configs/cloudinary.config');

router.post("/create-doctor", facilityStaffController.createDoctor);
router.post("/create-manager", facilityStaffController.createManager);
router.post("/login", facilityStaffController.login);
router.put("/change-password", checkStaff(),facilityStaffController.changePassword);
router.get("/get-doctor", facilityStaffController.getDoctor);
router.get("/get-manager", facilityStaffController.getAllManager);
router.put("/inactive/:id", facilityStaffController.inactive);
router.get("/get-all-doctor", facilityStaffController.getAllDoctor);
router.get("/get-role", checkStaff(),facilityStaffController.getRole);
router.post("/update-profile", checkStaff(), fileUploader.single('file'), facilityStaffController.update);
router.post("/forget-password", facilityStaffController.forgetPassword);

module.exports = router;