const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const {
  createEvent,
  getAllEvents,
  updateEvent,
  rsvpEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.post("/", protect, isAdmin, createEvent);
router.get("/", protect, getAllEvents);
router.put("/:id", protect, isAdmin, updateEvent);
router.patch("/:id/rsvp", protect, rsvpEvent);
router.delete("/:id", protect, isAdmin, deleteEvent);

module.exports = router;
