const facilityStaffController = require("../controllers/FacilityStaffController");
const express = require("express");
const router = express.Router();
const checkStaff = require("../middlewares/checkStaff");
const fileUploader = require('../configs/cloudinary.config');
const {staffRole} = require("../utils/constants");

router.post("/create", checkStaff(staffRole.MANAGER), facilityStaffController.createDoctor);
router.post("/create-manager", checkStaff(staffRole.ADMIN), facilityStaffController.createManager);
router.post("/login", facilityStaffController.login);
router.put("/change-password", checkStaff(),facilityStaffController.changePassword);
router.get("/get-doctor", facilityStaffController.getDoctor);
router.get("/get-manager", facilityStaffController.getAllManager);
router.patch("/inactive/:id", checkStaff(staffRole.MANAGER), facilityStaffController.inactive);
router.get("/get-all-doctor", facilityStaffController.getAllDoctor);
router.get("/get-role", checkStaff(),facilityStaffController.getRole);
router.post("/update-profile", checkStaff(), fileUploader.single('file'), facilityStaffController.update);
router.post("/forget-password", facilityStaffController.forgetPassword);
router.get("/get-all-staff", checkStaff(staffRole.MANAGER), facilityStaffController.getAllStaffByFacility);
router.get("/get-all-staff-by-facility", checkStaff(staffRole.MANAGER), facilityStaffController.getAllStaffByFacility);
router.get("/get-doctors", checkStaff(staffRole.MANAGER), facilityStaffController.getDoctorByManager);


module.exports = router;