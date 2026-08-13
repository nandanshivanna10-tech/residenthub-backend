const asyncHandler = require("express-async-handler");
const Event = require("../models/Event");

// @desc    List events, optional ?filter=upcoming|past|my
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const filter = {};
  const now = new Date();

  if (req.query.filter === "upcoming") filter.date = { $gte: now };
  if (req.query.filter === "past") filter.date = { $lt: now };
  if (req.query.filter === "my") filter.attendees = req.user._id;
  if (req.query.search) filter.title = { $regex: req.query.search, $options: "i" };

  const events = await Event.find(filter).sort({ date: 1 });

  const data = events.map((e) => ({
    ...e.toObject(),
    isRegistered: e.attendees.some((a) => a.toString() === req.user._id.toString()),
  }));

  res.json({ success: true, count: data.length, data });
});

// @desc    Create event (Admin only)
// @route   POST /api/events
// @access  Private (admin)
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, category, organizedBy, date, venue, imageUrl } = req.body;

  if (!title || !description || !organizedBy || !date || !venue) {
    res.status(400);
    throw new Error("title, description, organizedBy, date and venue are required");
  }

  const event = await Event.create({ title, description, category, organizedBy, date, venue, imageUrl });
  res.status(201).json({ success: true, data: event });
});

// @desc    RSVP / Register for an event
// @route   PUT /api/events/:id/rsvp
// @access  Private (resident)
const rsvpEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const already = event.attendees.some((a) => a.toString() === req.user._id.toString());
  if (already) {
    res.status(400);
    throw new Error("Already registered for this event");
  }

  event.attendees.push(req.user._id);
  await event.save();
  res.json({ success: true, message: "Registered successfully", data: event });
});

// @desc    Cancel RSVP
// @route   PUT /api/events/:id/unrsvp
// @access  Private (resident)
const cancelRsvp = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  event.attendees = event.attendees.filter((a) => a.toString() !== req.user._id.toString());
  await event.save();
  res.json({ success: true, message: "Registration cancelled", data: event });
});

module.exports = { getEvents, createEvent, rsvpEvent, cancelRsvp };
