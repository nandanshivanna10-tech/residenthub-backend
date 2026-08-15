const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
} = require("../controllers/maintenanceController");

router.post("/", protect, createRequest);
router.get("/my-requests", protect, getMyRequests);
router.get("/", protect, getAllRequests);
router.patch("/:id/status", protect, updateRequestStatus);
router.delete("/:id", protect, deleteRequest);

module.exports = router;
