const asyncHandler = require("express-async-handler");
const Visitor = require("../models/Visitor");

// @desc    Expected visitors for logged-in resident (or all, for security/admin)
// @route   GET /api/visitors/expected
// @access  Private
const getExpectedVisitors = asyncHandler(async (req, res) => {
  const filter = { status: "Expected" };
  if (req.user.role === "resident") filter.resident = req.user._id;

  const visitors = await Visitor.find(filter)
    .populate("resident", "fullName tower unit")
    .sort({ expectedDateTime: 1 });

  res.json({ success: true, count: visitors.length, data: visitors });
});

// @desc    Check-in history (Checked In / Checked Out)
// @route   GET /api/visitors/history
// @access  Private
const getVisitorHistory = asyncHandler(async (req, res) => {
  const filter = { status: { $in: ["Checked In", "Checked Out"] } };
  if (req.user.role === "resident") filter.resident = req.user._id;

  const visitors = await Visitor.find(filter)
    .populate("resident", "fullName tower unit")
    .sort({ checkInTime: -1 })
    .limit(50);

  res.json({ success: true, count: visitors.length, data: visitors });
});

// @desc    Pre-register a visitor ("Pre-Registration Form")
// @route   POST /api/visitors
// @access  Private (resident)
const preRegisterVisitor = asyncHandler(async (req, res) => {
  const { visitorName, phone, visitorKind, relationOrService, purpose, expectedDateTime, vehicleNumber } =
    req.body;

  if (!visitorName || !purpose || !expectedDateTime) {
    res.status(400);
    throw new Error("visitorName, purpose and expectedDateTime are required");
  }

  const visitor = await Visitor.create({
    resident: req.user._id,
    tower: req.user.tower,
    unit: req.user.unit,
    visitorName,
    phone,
    visitorKind,
    relationOrService,
    purpose,
    expectedDateTime,
    vehicleNumber,
  });

  res.status(201).json({ success: true, data: visitor });
});

// @desc    Edit an existing pass ("Edit Pass" button)
// @route   PUT /api/visitors/:id
// @access  Private
const updateVisitorPass = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) {
    res.status(404);
    throw new Error("Visitor pass not found");
  }

  const editable = ["visitorName", "phone", "purpose", "expectedDateTime", "vehicleNumber", "relationOrService"];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) visitor[field] = req.body[field];
  });

  await visitor.save();
  res.json({ success: true, data: visitor });
});

// @desc    Revoke a pending pass ("Revoke" button)
// @route   PUT /api/visitors/:id/revoke
// @access  Private
const revokeVisitorPass = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) {
    res.status(404);
    throw new Error("Visitor pass not found");
  }
  visitor.status = "Revoked";
  await visitor.save();
  res.json({ success: true, data: visitor });
});

// @desc    Security guard checks a visitor in
// @route   PUT /api/visitors/:id/check-in
// @access  Private (security, admin)
const checkInVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) {
    res.status(404);
    throw new Error("Visitor pass not found");
  }
  visitor.status = "Checked In";
  visitor.checkInTime = new Date();
  visitor.checkedInBy = req.user._id;
  await visitor.save();
  res.json({ success: true, data: visitor });
});

// @desc    Security guard checks a visitor out
// @route   PUT /api/visitors/:id/check-out
// @access  Private (security, admin)
const checkOutVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) {
    res.status(404);
    throw new Error("Visitor pass not found");
  }
  visitor.status = "Checked Out";
  visitor.checkOutTime = new Date();
  visitor.checkedOutBy = req.user._id;
  await visitor.save();
  res.json({ success: true, data: visitor });
});

module.exports = {
  getExpectedVisitors,
  getVisitorHistory,
  preRegisterVisitor,
  updateVisitorPass,
  revokeVisitorPass,
  checkInVisitor,
  checkOutVisitor,
};
