const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isStaff = require("../middleware/staffMiddleware");
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
router.get("/all", protect, isStaff, getAllVisitors);
router.patch("/:id/check-in", protect, isStaff, checkInVisitor);
router.patch("/:id/check-out", protect, isStaff, checkOutVisitor);
router.patch("/:id/revoke", protect, revokePass);
router.put("/:id", protect, updateVisitor);

module.exports = router;
