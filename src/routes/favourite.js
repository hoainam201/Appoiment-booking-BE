const favouriteController = require("../controllers/FavouriteController");
const express = require("express");
const router = express.Router();
const checkUser = require("../middlewares/checkUser");
const checkStaff = require("../middlewares/checkStaff");
const {staffRole} = require("../utils/constants");

router.post("/create", checkUser, favouriteController.create);
router.delete("/destroy", checkUser, favouriteController.destroy);

module.exports = router;