const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  preRegisterVisitor,
  getExpectedVisitors,
  getCheckInHistory,
  getAllExpectedForSecurity,
  getAllHistoryForSecurity,
  scanQrCode,
  checkInVisitor,
  checkOutVisitor,
  revokePass,
  updateVisitor,
} = require("../controllers/visitorController");

router.post("/", protect, preRegisterVisitor);
router.get("/expected", protect, getExpectedVisitors);
router.get("/history", protect, getCheckInHistory);
router.get("/security/expected", protect, getAllExpectedForSecurity);
router.get("/security/history", protect, getAllHistoryForSecurity);
router.post("/scan", protect, scanQrCode);
router.patch("/:id/check-in", protect, checkInVisitor);
router.patch("/:id/check-out", protect, checkOutVisitor);
router.patch("/:id/revoke", protect, revokePass);
router.put("/:id", protect, updateVisitor);

module.exports = router;
