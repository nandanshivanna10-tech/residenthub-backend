const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Resident directory list, ?search=&tower=
// @route   GET /api/directory
// @access  Private
const getDirectory = asyncHandler(async (req, res) => {
  const filter = { role: "resident", isActive: true };

  if (req.query.tower && req.query.tower !== "All") filter.tower = req.query.tower;
  if (req.query.search) {
    filter.$or = [
      { fullName: { $regex: req.query.search, $options: "i" } },
      { unit: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const residents = await User.find(filter).sort({ fullName: 1 });
  res.json({
    success: true,
    count: residents.length,
    data: residents.map((r) => r.toDirectoryJSON()),
  });
});

// @desc    Single resident detail panel
// @route   GET /api/directory/:id
// @access  Private
const getDirectoryEntry = asyncHandler(async (req, res) => {
  const resident = await User.findById(req.params.id);
  if (!resident || resident.role !== "resident") {
    res.status(404);
    throw new Error("Resident not found");
  }
  res.json({ success: true, data: resident.toDirectoryJSON() });
});

module.exports = { getDirectory, getDirectoryEntry };
