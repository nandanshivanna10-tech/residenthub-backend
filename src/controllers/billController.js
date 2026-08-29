const Bill = require("../models/Bill");
const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");
const createNotification = require("../utils/createNotification");

exports.createBill = async (req, res) => {
  try {
    const { type, amount, dueDate, userId } = req.body;

    if (!type || !amount || !dueDate) {
      return res.status(400).json({ message: "Type, amount, and due date are required" });
    }

    const bill = await Bill.create({
      user: userId || req.user.id,
      type,
      amount,
      dueDate,
      status: "Unpaid",
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Failed to create bill", error: error.message });
  }
};

exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("user", "fullName tower unit email")
      .sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all bills", error: error.message });
  }
};

exports.getPendingBills = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user.id, status: "Unpaid" }).sort({ dueDate: 1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending bills", error: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user.id, status: "Paid" }).sort({ paidOn: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment history", error: error.message });
  }
};

exports.getBillSummary = async (req, res) => {
  try {
    const totalDueBill = await Bill.findOne({ user: req.user.id, status: "Unpaid" }).sort({ dueDate: 1 });
    const lastPaidBill = await Bill.findOne({ user: req.user.id, status: "Paid" }).sort({ paidOn: -1 });

    const allUnpaid = await Bill.find({ user: req.user.id, status: "Unpaid" });
    const totalDue = allUnpaid.reduce((sum, b) => sum + b.amount, 0);

    res.status(200).json({
      totalDue,
      nextDueDate: totalDueBill ? totalDueBill.dueDate : null,
      lastPaymentAmount: lastPaidBill ? lastPaidBill.amount : 0,
      lastPaymentDate: lastPaidBill ? lastPaidBill.paidOn : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bill summary", error: error.message });
  }
};

exports.createPaymentOrder = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    if (bill.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to pay this bill" });
    }
    if (bill.status === "Paid") {
      return res.status(400).json({ message: "This bill is already paid" });
    }
    if (bill.amount < 10) {
      return res.status(400).json({ message: "Bill amount must be at least ₹10.00 to process payment" });
    }

    const amountInPaise = Math.round(bill.amount * 100);

    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: "bill_" + bill._id,
    });

    bill.razorpayOrderId = order.id;
    await bill.save();

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      billId: bill._id,
    });
  } catch (error) {
    console.error("createPaymentOrder error:", error);
    res.status(500).json({ message: "Failed to create payment order", error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { billId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    bill.status = "Paid";
    bill.paidOn = new Date();
    bill.transactionId = razorpay_payment_id;
    bill.razorpayPaymentId = razorpay_payment_id;
    await bill.save();

    await createNotification({
      userId: bill.user,
      title: "Payment Successful",
      message: "Your payment of ₹" + bill.amount + " for " + bill.type + " was successful",
      type: "bill",
      link: "/bills",
    });

    res.status(200).json({ message: "Payment verified successfully", bill });
  } catch (error) {
    console.error("verifyPayment error:", error);
    res.status(500).json({ message: "Failed to verify payment", error: error.message });
  }
};
