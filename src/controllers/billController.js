const Bill = require("../models/Bill");
const { v4: uuidv4 } = require("uuid");

exports.createBill = async (req, res) => {
  try {
    const { type, amount, dueDate, userId } = req.body;

    if (!type || !amount || !dueDate || !userId) {
      return res.status(400).json({ message: "Type, amount, due date, and resident are required" });
    }

    const bill = await Bill.create({
      user: userId,
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
      nextDueDate: totalDueBill?.dueDate || null,
      lastPaymentAmount: lastPaidBill?.amount || 0,
      lastPaymentDate: lastPaidBill?.paidOn || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bill summary", error: error.message });
  }
};

exports.payBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    if (bill.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to pay this bill" });
    }

    bill.status = "Paid";
    bill.paidOn = new Date();
    bill.transactionId = `TXN-${uuidv4().slice(0, 8).toUpperCase()}`;
    await bill.save();

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Failed to process payment", error: error.message });
  }
};

exports.getAllBills = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "All" ? { status } : {};

    const bills = await Bill.find(filter)
      .populate("user", "fullName tower unit")
      .sort({ dueDate: -1 });

    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all bills", error: error.message });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    await bill.deleteOne();
    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete bill", error: error.message });
  }
};
