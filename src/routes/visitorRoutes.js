const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  preRegisterVisitor,
  getExpectedVisitors,
  getCheckInHistory,
  checkInVisitor,
  checkOutVisitor,
  revokePass,
  updateVisitor,
} = require("../controllers/visitorController");

router.post("/", protect, preRegisterVisitor);
router.get("/expected", protect, getExpectedVisitors);
router.get("/history", protect, getCheckInHistory);
router.patch("/:id/check-in", protect, checkInVisitor);
router.patch("/:id/check-out", protect, checkOutVisitor);
router.patch("/:id/revoke", protect, revokePass);
router.put("/:id", protect, updateVisitor);

module.exports = router;
