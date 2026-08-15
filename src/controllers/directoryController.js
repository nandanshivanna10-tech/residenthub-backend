const User = require("../models/User");

exports.getDirectory = async (req, res) => {
  try {
    const { search, tower } = req.query;
    let query = {};

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
