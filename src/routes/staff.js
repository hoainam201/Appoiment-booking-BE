const facilityStaffController = require("../controllers/FacilityStaffController");
const express = require("express");
const router = express.Router();

router.post("/create-doctor", facilityStaffController.createDoctor);
router.post("/create-manager", facilityStaffController.createManager);
router.post("/login", facilityStaffController.login);
router.put("/change-password", facilityStaffController.changePassword);
router.get("/get-doctor", facilityStaffController.getDoctor);
router.get("/get-manager", facilityStaffController.getAllManager);
router.put("/inactive/:id", facilityStaffController.inactive);