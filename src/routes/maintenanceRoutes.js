const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
} = require("../controllers/maintenanceController");

router.post("/", protect, createRequest);
router.get("/my-requests", protect, getMyRequests);
router.get("/", protect, isAdmin, getAllRequests);
router.patch("/:id/status", protect, isAdmin, updateRequestStatus);
router.delete("/:id", protect, deleteRequest);

module.exports = router;
