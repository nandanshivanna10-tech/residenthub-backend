const express = require("express");
const router = express.Router();
const {
  getExpectedVisitors,
  getVisitorHistory,
  preRegisterVisitor,
  updateVisitorPass,
  revokeVisitorPass,
  checkInVisitor,
  checkOutVisitor,
} = require("../controllers/visitorController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/expected", getExpectedVisitors);
router.get("/history", getVisitorHistory);
router.post("/", preRegisterVisitor);
router.put("/:id", updateVisitorPass);
router.put("/:id/revoke", revokeVisitorPass);
router.put("/:id/check-in", authorize("security", "admin"), checkInVisitor);
router.put("/:id/check-out", authorize("security", "admin"), checkOutVisitor);

module.exports = router;
