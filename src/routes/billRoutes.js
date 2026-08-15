const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createBill,
  getPendingBills,
  getPaymentHistory,
  getBillSummary,
  payBill,
} = require("../controllers/billController");

router.post("/", protect, createBill);
router.get("/pending", protect, getPendingBills);
router.get("/history", protect, getPaymentHistory);
router.get("/summary", protect, getBillSummary);
router.patch("/:id/pay", protect, payBill);

module.exports = router;
