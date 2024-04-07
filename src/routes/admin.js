const adminController = require("../controllers/AdminController");
const express = require("express");
const router = express.Router();

router.post("/create", adminController.create);
router.post("/login", adminController.login);

module.exports = router;