const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const {
  preRegisterVisitor,
  getExpectedVisitors,
  getCheckInHistory,
  getAllVisitors,
  checkInVisitor,
  checkOutVisitor,
  revokePass,
  updateVisitor,
} = require("../controllers/visitorController");

router.post("/", protect, preRegisterVisitor);
router.get("/expected", protect, getExpectedVisitors);
router.get("/history", protect, getCheckInHistory);
router.get("/all", protect, isAdmin, getAllVisitors);
router.patch("/:id/check-in", protect, isAdmin, checkInVisitor);
router.patch("/:id/check-out", protect, isAdmin, checkOutVisitor);
router.patch("/:id/revoke", protect, revokePass);
router.put("/:id", protect, updateVisitor);

module.exports = router;
