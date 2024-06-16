const newsController = require("../controllers/NewsController");
const express = require("express");
const router = express.Router();
const checkStaff = require("../middlewares/checkStaff");
const {staffRole} = require("../utils/constants");
const fileUploader = require('../configs/cloudinary.config');

router.post("/", checkStaff(staffRole.DOCTOR), fileUploader.single('file'), newsController.create);
router.get("/", newsController.getAll);
router.get("/get-by-doctor", checkStaff(staffRole.DOCTOR), newsController.getByDocId);
router.get("/latest", newsController.getLatest);
router.get("/:id", newsController.getById);
router.put("/:id", checkStaff(staffRole.DOCTOR), fileUploader.single("file"),  newsController.update);
router.patch("/hide/:id", newsController.hide);
router.patch("/show/:id", newsController.show);

module.exports = router;