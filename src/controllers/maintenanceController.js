const asyncHandler = require("express-async-handler");
const Maintenance = require("../models/Maintenance");
const Notification = require("../models/Notification");

// @desc    List maintenance requests
//          Resident -> own requests only. Admin/Security -> all (with optional ?tower=&status=)
// @route   GET /api/maintenance
// @access  Private
const getMaintenanceRequests = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === "resident") {
    filter.resident = req.user._id;
  } else {
    if (req.query.tower) filter.tower = req.query.tower;
    if (req.query.status) filter.status = req.query.status;
  }
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.description = { $regex: req.query.search, $options: "i" };
  }

  const requests = await Maintenance.find(filter)
    .populate("resident", "fullName tower unit")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: requests.length, data: requests });
});

// @desc    Get single maintenance request
// @route   GET /api/maintenance/:id
// @access  Private
const getMaintenanceRequest = asyncHandler(async (req, res) => {
  const request = await Maintenance.findById(req.params.id).populate(
    "resident",
    "fullName tower unit phone"
  );
  if (!request) {
    res.status(404);
    throw new Error("Maintenance request not found");
  }
  res.json({ success: true, data: request });
});

// @desc    Submit new request ("+ New Request" form: Category, Description, Urgency Priority)
// @route   POST /api/maintenance
// @access  Private (resident)
const createMaintenanceRequest = asyncHandler(async (req, res) => {
  const { category, description, priority } = req.body;

  if (!category || !description) {
    res.status(400);
    throw new Error("Category and description are required");
  }

  const request = await Maintenance.create({
    resident: req.user._id,
    tower: req.user.tower,
    unit: req.user.unit,
    category,
    description,
    priority: priority || "Low",
  });

  res.status(201).json({ success: true, data: request });
});

// @desc    Update status / assign / add comment (Admin/Security)
// @route   PUT /api/maintenance/:id
// @access  Private (admin, security)
const updateMaintenanceRequest = asyncHandler(async (req, res) => {
  const request = await Maintenance.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error("Maintenance request not found");
  }

  const { status, priority, assignedTo, comment } = req.body;
  if (status) {
    request.status = status;
    if (status === "Resolved") request.resolvedAt = new Date();
  }
  if (priority) request.priority = priority;
  if (assignedTo !== undefined) request.assignedTo = assignedTo;
  if (comment) request.comments.push({ author: req.user._id, text: comment });

  await request.save();

  if (status) {
    await Notification.create({
      user: request.resident,
      title: "Maintenance update",
      message: `Your request ${request.requestId} is now "${status}"`,
      type: "maintenance",
      link: "/maintenance",
    });
  }

  res.json({ success: true, data: request });
});

// @desc    Cancel/delete a request
// @route   DELETE /api/maintenance/:id
// @access  Private
const deleteMaintenanceRequest = asyncHandler(async (req, res) => {
  const request = await Maintenance.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error("Maintenance request not found");
  }

  const isOwner = request.resident.toString() === req.user._id.toString();
  if (!isOwner && req.user.role === "resident") {
    res.status(403);
    throw new Error("Not authorized to delete this request");
  }

  await request.deleteOne();
  res.json({ success: true, message: "Request removed" });
});

module.exports = {
  getMaintenanceRequests,
  getMaintenanceRequest,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
};
