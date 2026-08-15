const Maintenance = require("../models/Maintenance");

exports.createRequest = async (req, res) => {
  try {
    const { category, description, priority } = req.body;

    if (!category || !description) {
      return res.status(400).json({ message: "Category and description are required" });
    }

    const request = await Maintenance.create({
      user: req.user.id,
      category,
      description,
      priority: priority || "Low",
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to create request", error: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find()
      .populate("user", "fullName tower unit")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error: error.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Maintenance.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status || request.status;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to update request", error: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this request" });
    }

    await request.deleteOne();
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete request", error: error.message });
  }
};
