const express = require("express");
const router = express.Router();
const {
  getMaintenanceRequests,
  getMaintenanceRequest,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
} = require("../controllers/maintenanceController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getMaintenanceRequests).post(createMaintenanceRequest);

router
  .route("/:id")
  .get(getMaintenanceRequest)
  .put(authorize("admin", "security"), updateMaintenanceRequest)
  .delete(deleteMaintenanceRequest);

module.exports = router;
