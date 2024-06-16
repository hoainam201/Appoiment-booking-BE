const ServiceReviewController = require("../controllers/ServiceReviewController");
const express = require("express");
const router = express.Router();
const   checkUser = require("../middlewares/checkUser");

router.post("/create", checkUser, ServiceReviewController.create);
router.get("/get/:id", ServiceReviewController.get);
router.get("/service/:id", ServiceReviewController.getAllByService);
router.put("/update/:id", checkUser, ServiceReviewController.update);
router.get("/facility/:id", ServiceReviewController.getAllByFacility);
router.get("/facility/user/:id", checkUser, ServiceReviewController.getAllByFacilityAndUser);
router.get("/service/user/:id", checkUser, ServiceReviewController.getAllByUser);
router.get("/rating/:id", ServiceReviewController.ratingByService);

module.exports = router;