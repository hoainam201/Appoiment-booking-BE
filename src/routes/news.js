const newsController = require("../controllers/NewsController");
const express = require("express");
const router = express.Router();
const checkStaff = require("../middlewares/checkStaff");
const staffRole = require("../utils/constants");

router.post("/", checkStaff(staffRole.DOCTOR),newsController.create);
router.get("/", newsController.getAll);
router.get("/get-by-doctor", checkStaff(staffRole.DOCTOR), newsController.getByDocId);
router.get("/:id", newsController.getById);
router.put("/:id", newsController.update);
router.patch("/hide/:id", newsController.hide);
router.patch("/show/:id", newsController.show);

module.exports = router;