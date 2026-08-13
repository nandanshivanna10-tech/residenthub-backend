const express = require("express");
const router = express.Router();
const {
  getBillSummary,
  getPendingBills,
  getPaymentHistory,
  createBill,
  payBill,
} = require("../controllers/billController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/summary", getBillSummary);
router.get("/pending", getPendingBills);
router.get("/history", getPaymentHistory);
router.post("/", authorize("admin"), createBill);
router.put("/:id/pay", payBill);

module.exports = router;
