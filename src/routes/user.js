const userController = require("../controllers/UserController");
const express = require("express");
const router = express.Router();
const checkUser = require("../middlewares/checkUser");

router.post("/register", userController.createUser);
router.get("/find-user", checkUser, userController.findUser);
router.post("/login", userController.login);
router.put("/update-user", checkUser, userController.updateUser);
router.put("/change-password", checkUser, userController.changePassword);
router.post("/forget-password", userController.forgotPassword);

module.exports = router;