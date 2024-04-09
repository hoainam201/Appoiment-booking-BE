const facilityReviewController = require("../controllers/FacilityReviewController");
const express = require("express");
const router = express.Router();
const checkUser = require("../middlewares/checkUser");

router.post("/create", checkUser,facilityReviewController.create);
router.get("/get-review-by-facility/:id", facilityReviewController.getAll);
router.put("/update", checkUser, facilityReviewController.update);
router.delete("/destroy", checkUser, facilityReviewController.destroy);
router.patch("/change-visibility", checkUser, facilityReviewController.changeVisibility);

module.exports = router;