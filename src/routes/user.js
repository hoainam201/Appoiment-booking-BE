const userController = require("../controllers/UserController");
const express = require("express");
const router = express.Router();
const checkUser = require("../middlewaves/checkUser");

router.post("/create", userController.createUser);
router.get("/find-user", checkUser, userController.findUser);
router.post("/login", userController.login);
router.put("/update-user", checkUser, userController.updateUser);

module.exports = router;