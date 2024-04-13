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
router.put("/:id/hide", newsController.hide);
router.put("/:id/show", newsController.show);

module.exports = router;