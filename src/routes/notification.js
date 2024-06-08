const notificationController = require("../controllers/NotificaitonController");
const express = require("express");
const router = express.Router();
const checkStaff = require("../middlewares/checkStaff");

router.get("/all", checkStaff(), notificationController.getAll);
router.get("/see-all", checkStaff(), notificationController.seeAll);

module.exports = router;