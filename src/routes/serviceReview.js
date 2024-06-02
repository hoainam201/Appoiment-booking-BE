const ServiceReviewController = require("../controllers/ServiceReviewController");
const express = require("express");
const router = express.Router();
const   checkUser = require("../middlewares/checkUser");

router.post("/create", checkUser, ServiceReviewController.create);
router.get("/:id", ServiceReviewController.getAllByService);

module.exports = router;