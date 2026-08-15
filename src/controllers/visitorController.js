const Visitor = require("../models/Visitor");

exports.preRegisterVisitor = async (req, res) => {
  try {
    const { name, phone, purpose, vehicleNumber, expectedAt } = req.body;

    if (!name || !expectedAt) {
      return res.status(400).json({ message: "Visitor name and expected date/time are required" });
    }

    const visitor = await Visitor.create({
      user: req.user.id,
      name,
      phone,
      purpose,
      vehicleNumber,
      expectedAt,
      status: "Expected",
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

exports.checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    visitor.status = "Checked In";
    visitor.checkInTime = new Date();
    await visitor.save();
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

    const { name, phone, purpose, vehicleNumber, expectedAt } = req.body;
    visitor.name = name || visitor.name;
    visitor.phone = phone || visitor.phone;
    visitor.purpose = purpose || visitor.purpose;
    visitor.vehicleNumber = vehicleNumber || visitor.vehicleNumber;
    visitor.expectedAt = expectedAt || visitor.expectedAt;

    await visitor.save();
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ message: "Failed to update visitor", error: error.message });
  }
};
