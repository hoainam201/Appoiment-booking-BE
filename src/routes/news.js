const newsController = require("../controllers/NewsController");
const express = require("express");
const router = express.Router();

router.post("/", newsController.create);
router.get("/", newsController.getAll);
router.get("/:id", newsController.getById);
router.put("/:id", newsController.update);
router.put("/:id/hide", newsController.hide);
router.put("/:id/show", newsController.show);
router.get("get-by-doctor", newsController.getByDocId);

module.exports = router;