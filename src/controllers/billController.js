const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const Bill = require("../models/Bill");

// @desc    Summary cards: Total Due, Last Payment, Next Bill Cycle
// @route   GET /api/bills/summary
// @access  Private (resident)
const getBillSummary = asyncHandler(async (req, res) => {
  const residentId = req.user.role === "resident" ? req.user._id : req.query.residentId;

  const unpaid = await Bill.find({ resident: residentId, status: "Unpaid" });
  const totalDue = unpaid.reduce((sum, b) => sum + b.amount, 0);

  const lastPaid = await Bill.findOne({ resident: residentId, status: "Paid" }).sort({
    paymentDate: -1,
  });

  const nextDue = unpaid.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

  res.json({
    success: true,
    data: {
      totalDue,
      dueDate: nextDue?.dueDate || null,
      lastPayment: lastPaid
        ? { amount: lastPaid.amount, paidOn: lastPaid.paymentDate }
        : null,
      nextBillCycle: nextDue?.billingCycle || null,
    },
  });
});

// @desc    Pending bills table
// @route   GET /api/bills/pending
// @access  Private
const getPendingBills = asyncHandler(async (req, res) => {
  const filter = { status: { $in: ["Unpaid", "Overdue"] } };
  if (req.user.role === "resident") filter.resident = req.user._id;
  else if (req.query.residentId) filter.resident = req.query.residentId;

  const bills = await Bill.find(filter).populate("resident", "fullName tower unit").sort({ dueDate: 1 });
  res.json({ success: true, count: bills.length, data: bills });
});

// @desc    Payment history table
// @route   GET /api/bills/history
// @access  Private
const getPaymentHistory = asyncHandler(async (req, res) => {
  const filter = { status: "Paid" };
  if (req.user.role === "resident") filter.resident = req.user._id;
  else if (req.query.residentId) filter.resident = req.query.residentId;

  const bills = await Bill.find(filter).sort({ paymentDate: -1 }).limit(50);
  res.json({ success: true, count: bills.length, data: bills });
});

// @desc    Admin creates/generates a bill for a resident
// @route   POST /api/bills
// @access  Private (admin)
const createBill = asyncHandler(async (req, res) => {
  const { resident, billType, amount, dueDate, billingCycle, description } = req.body;

  if (!resident || !billType || !amount || !dueDate) {
    res.status(400);
    throw new Error("resident, billType, amount and dueDate are required");
  }

  const bill = await Bill.create({ resident, billType, amount, dueDate, billingCycle, description });
  res.status(201).json({ success: true, data: bill });
});

// @desc    "Pay Now" - mark a bill as paid
// @route   PUT /api/bills/:id/pay
// @access  Private (resident)
const payBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }
  if (bill.status === "Paid") {
    res.status(400);
    throw new Error("This bill is already paid");
  }

  bill.status = "Paid";
  bill.paymentDate = new Date();
  bill.transactionId = `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;
  bill.paymentMethod = req.body.paymentMethod || "Card";
  bill.receiptUrl = `/receipts/${uuidv4()}.pdf`; // placeholder until a receipt-generation service is wired up

  await bill.save();
  res.json({ success: true, data: bill });
});

module.exports = { getBillSummary, getPendingBills, getPaymentHistory, createBill, payBill };
