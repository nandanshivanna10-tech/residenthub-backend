const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const { getDashboardSummary, getAdminDashboardSummary } = require("../controllers/dashboardController");

router.get("/", protect, getDashboardSummary);
router.get("/admin", protect, isAdmin, getAdminDashboardSummary);

module.exports = router;
