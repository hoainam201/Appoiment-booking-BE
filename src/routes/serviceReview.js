const ServiceReviewController = require("../controllers/ServiceReviewController");
const express = require("express");
const router = express.Router();
const   checkUser = require("../middlewares/checkUser");

router.post("/create", checkUser, ServiceReviewController.create);
router.get("/get/:id", ServiceReviewController.get);
router.get("/service/:id", ServiceReviewController.getAllByService);
router.put("/update/:id", checkUser, ServiceReviewController.update);
router.get("/facility/:id", ServiceReviewController.getAllByFacility);

module.exports = router;