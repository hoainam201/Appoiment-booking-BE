const userController = require("../controllers/UserController");
const express = require("express");
const router = express.Router();
const checkUser = require("../middlewares/checkUser");
const checkStaff = require("../middlewares/checkStaff");
const {staffRole} = require("../utils/constants");

router.post("/register", userController.createUser);
router.get("/find-user", checkUser, userController.findUser);
router.post("/login", userController.login);
router.put("/update-user", checkUser, userController.updateUser);
router.put("/change-password", checkUser, userController.changePassword);
router.post("/forget-password", userController.forgotPassword);
router.put("/inactive/:id", checkStaff(staffRole.ADMIN), userController.inactive);
router.put("/active/:id", checkStaff(staffRole.ADMIN), userController.active);
router.get("/all", checkStaff(staffRole.ADMIN), userController.getAll);

module.exports = router;