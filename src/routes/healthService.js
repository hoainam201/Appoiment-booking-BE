const healthServiceController = require("../controllers/healthServiceController");
const router = require("express").Router();
const checkStaff = require("../middlewares/checkStaff");
const {staffRole} = require("../utils/constants");
const fileUploader = require('../configs/cloudinary.config');

router.get("/doctors", healthServiceController.getAllDoctors);
router.get("/packages", healthServiceController.getAllPackages);
router.get("/get-all-by-token", checkStaff(staffRole.MANAGER), healthServiceController.getAllByToken);
router.get("/:id", healthServiceController.findById);
router.post("/", checkStaff(staffRole.MANAGER), fileUploader.single('file'),healthServiceController.create);
router.put("/:id", checkStaff(staffRole.MANAGER), fileUploader.single('file'), healthServiceController.update);

module.exports = router;