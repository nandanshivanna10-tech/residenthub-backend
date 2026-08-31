const Visitor = require("../models/Visitor");
const crypto = require("crypto");
const createNotification = require("../utils/createNotification");

exports.preRegisterVisitor = async (req, res) => {
  try {
    const { name, phone, countryCode, purpose, vehicleNumber, expectedAt } = req.body;

    if (!name || !expectedAt) {
      return res.status(400).json({ message: "Visitor name and expected date/time are required" });
    }

    const qrCode = crypto.randomBytes(16).toString("hex");

    const visitor = await Visitor.create({
      user: req.user.id,
      name,
      phone,
      countryCode: countryCode || "+91",
      purpose,
      vehicleNumber,
      expectedAt,
      status: "Expected",
      qrCode,
    });

    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ message: "Failed to pre-register visitor", error: error.message });
  }
};

exports.getExpectedVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ user: req.user.id, status: "Expected" }).sort({ expectedAt: 1 });
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expected visitors", error: error.message });
  }
};

exports.getCheckInHistory = async (req, res) => {
  try {
    const visitors = await Visitor.find({
      user: req.user.id,
      status: { $in: ["Checked Out", "Checked In"] },
    }).sort({ checkInTime: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch check-in history", error: error.message });
  }
};

exports.getAllExpectedForSecurity = async (req, res) => {
  try {
    const visitors = await Visitor.find({ status: "Expected" })
      .populate("user", "fullName tower unit phone")
      .sort({ expectedAt: 1 });
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expected visitors", error: error.message });
  }
};

exports.getAllHistoryForSecurity = async (req, res) => {
  try {
    const visitors = await Visitor.find({ status: { $in: ["Checked Out", "Checked In"] } })
      .populate("user", "fullName tower unit phone")
      .sort({ checkInTime: -1 })
      .limit(50);
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history", error: error.message });
  }
};

exports.scanQrCode = async (req, res) => {
  try {
    const { qrCode } = req.body;
    if (!qrCode) {
      return res.status(400).json({ message: "QR code data is required" });
    }

    const visitor = await Visitor.findOne({ qrCode }).populate("user", "fullName tower unit phone");

    if (!visitor) {
      return res.status(404).json({ message: "Invalid or unrecognized QR code" });
    }

    if (visitor.status === "Revoked") {
      return res.status(400).json({ message: "This visitor pass has been revoked" });
    }

    if (visitor.status === "Checked Out") {
      return res.status(400).json({ message: "This visitor has already checked out" });
    }

    res.status(200).json({ visitor });
  } catch (error) {
    res.status(500).json({ message: "Failed to scan QR code", error: error.message });
  }
};

exports.checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    visitor.status = "Checked In";
    visitor.checkInTime = new Date();
    await visitor.save();

    await createNotification({
      userId: visitor.user,
      title: "Visitor Checked In",
      message: visitor.name + " has arrived and checked in at the gate",
      type: "visitor",
      link: "/visitors",
    });

    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ message: "Failed to check in visitor", error: error.message });
  }
};

exports.checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    visitor.status = "Checked Out";
    visitor.checkOutTime = new Date();
    await visitor.save();
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ message: "Failed to check out visitor", error: error.message });
  }
};

exports.revokePass = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    if (visitor.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to revoke this pass" });
    }
    visitor.status = "Revoked";
    await visitor.save();
    res.status(200).json({ message: "Visitor pass revoked" });
  } catch (error) {
    res.status(500).json({ message: "Failed to revoke pass", error: error.message });
  }
};

exports.updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    if (visitor.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this visitor" });
    }

    const { name, phone, countryCode, purpose, vehicleNumber, expectedAt } = req.body;
    visitor.name = name || visitor.name;
    visitor.phone = phone || visitor.phone;
    visitor.countryCode = countryCode || visitor.countryCode;
    visitor.purpose = purpose || visitor.purpose;
    visitor.vehicleNumber = vehicleNumber || visitor.vehicleNumber;
    visitor.expectedAt = expectedAt || visitor.expectedAt;

    await visitor.save();
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ message: "Failed to update visitor", error: error.message });
  }
};
