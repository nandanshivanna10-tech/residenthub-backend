const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createBill,
  getPendingBills,
  getPaymentHistory,
  getBillSummary,
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/billController");

router.post("/", protect, createBill);
router.get("/pending", protect, getPendingBills);
router.get("/history", protect, getPaymentHistory);
router.get("/summary", protect, getBillSummary);
router.post("/:id/create-order", protect, createPaymentOrder);
router.post("/verify-payment", protect, verifyPayment);

module.exports = router;
