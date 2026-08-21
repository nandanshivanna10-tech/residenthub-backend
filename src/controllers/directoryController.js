const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getDirectory = async (req, res) => {
  try {
    const { search, tower } = req.query;
    let query = { role: "resident" };

    if (tower && tower !== "All") {
      query.tower = tower;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { unit: { $regex: search, $options: "i" } },
      ];
    }

    const residents = await User.find(query).select(
      "fullName tower unit status phone email emergencyContact vehicleNumber createdAt"
    );

    res.status(200).json(residents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch directory", error: error.message });
  }
};

exports.getResidentById = async (req, res) => {
  try {
    const resident = await User.findById(req.params.id).select(
      "fullName tower unit status phone email emergencyContact vehicleNumber createdAt"
    );
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }
    res.status(200).json(resident);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resident", error: error.message });
  }
};

exports.createResident = async (req, res) => {
  try {
    const { fullName, email, phone, password, tower, unit, status } = req.body;

    if (!fullName || !email || !password || !tower || !unit) {
      return res.status(400).json({ message: "Full name, email, password, tower, and unit are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "A resident with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const resident = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: "resident",
      tower,
      unit,
      status: status || "owner",
    });

    res.status(201).json({
      _id: resident._id,
      fullName: resident.fullName,
      email: resident.email,
      phone: resident.phone,
      tower: resident.tower,
      unit: resident.unit,
      status: resident.status,
      createdAt: resident.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create resident", error: error.message });
  }
};

exports.updateResident = async (req, res) => {
  try {
    const resident = await User.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    const { fullName, phone, tower, unit, status, emergencyContact, vehicleNumber } = req.body;

    resident.fullName = fullName || resident.fullName;
    resident.phone = phone || resident.phone;
    resident.tower = tower || resident.tower;
    resident.unit = unit || resident.unit;
    resident.status = status || resident.status;
    resident.emergencyContact = emergencyContact || resident.emergencyContact;
    resident.vehicleNumber = vehicleNumber || resident.vehicleNumber;

    await resident.save();

    const updated = await User.findById(req.params.id).select(
      "fullName tower unit status phone email emergencyContact vehicleNumber createdAt"
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update resident", error: error.message });
  }
};

exports.deleteResident = async (req, res) => {
  try {
    const resident = await User.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }
    await resident.deleteOne();
    res.status(200).json({ message: "Resident removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove resident", error: error.message });
  }
};
