const ServiceReviewController = require("../controllers/ServiceReviewController");
const express = require("express");
const router = express.Router();

router.post("/create", ServiceReviewController.create);

module.exports = router;