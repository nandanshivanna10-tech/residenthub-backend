const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const {
  createBill,
  getPendingBills,
  getPaymentHistory,
  getBillSummary,
  payBill,
  getAllBills,
  deleteBill,
} = require("../controllers/billController");

router.post("/", protect, isAdmin, createBill);
router.get("/pending", protect, getPendingBills);
router.get("/history", protect, getPaymentHistory);
router.get("/summary", protect, getBillSummary);
router.get("/all", protect, isAdmin, getAllBills);
router.patch("/:id/pay", protect, payBill);
router.delete("/:id", protect, isAdmin, deleteBill);

module.exports = router;
