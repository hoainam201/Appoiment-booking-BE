const ServiceReviewController = require("../controllers/ServiceReviewController");
const express = require("express");
const router = express.Router();

router.post("/create", ServiceReviewController.create);
router.get("/:id", ServiceReviewController.getAllByService);

module.exports = router;