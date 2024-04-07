const healthServiceController = require("../controllers/healthServiceController");
const router = require("express").Router();
const checkStaff = require("../middlewares/checkStaff");
const {staffRole} = require("../utils/constants");

router.get("/doctors", healthServiceController.getAllDoctors);
router.get("/packages", healthServiceController.getAllPackages);
router.get("/:id", healthServiceController.findById);
router.post("/", checkStaff(staffRole.MANAGER),healthServiceController.create);
router.put("/:id", checkStaff(staffRole.MANAGER),healthServiceController.update);

module.exports = router;