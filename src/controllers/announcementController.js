const asyncHandler = require("express-async-handler");
const Announcement = require("../models/Announcement");

// @desc    List announcements, optional ?type=Notice|Alert|Event&search=
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type && req.query.type !== "All") filter.type = req.query.type;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const announcements = await Announcement.find(filter).sort({ isPinned: -1, createdAt: -1 });
  res.json({ success: true, count: announcements.length, data: announcements });
});

// @desc    Create announcement (Admin only)
// @route   POST /api/announcements
// @access  Private (admin)
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, description, type, postedBy, tower, isPinned, expiresAt } = req.body;

  if (!title || !description || !postedBy) {
    res.status(400);
    throw new Error("title, description and postedBy are required");
  }

  const announcement = await Announcement.create({
    title,
    description,
    type,
    postedBy,
    postedByUser: req.user._id,
    tower,
    isPinned,
    expiresAt,
  });

  res.status(201).json({ success: true, data: announcement });
});

// @desc    Update announcement (Admin only)
// @route   PUT /api/announcements/:id
// @access  Private (admin)
const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }
  res.json({ success: true, data: announcement });
});

// @desc    Delete announcement (Admin only)
// @route   DELETE /api/announcements/:id
// @access  Private (admin)
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }
  await announcement.deleteOne();
  res.json({ success: true, message: "Announcement removed" });
});

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
