const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const {
  createBill,
  getAllBills,
  getPendingBills,
  getPaymentHistory,
  getBillSummary,
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/billController");

router.post("/", protect, isAdmin, createBill);
router.get("/all", protect, isAdmin, getAllBills);
router.get("/pending", protect, getPendingBills);
router.get("/history", protect, getPaymentHistory);
router.get("/summary", protect, getBillSummary);
router.post("/:id/create-order", protect, createPaymentOrder);
router.post("/verify-payment", protect, verifyPayment);

module.exports = router;
