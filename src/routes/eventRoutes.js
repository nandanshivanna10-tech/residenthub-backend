const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const {
  createEvent,
  updateEvent,
  getAllEvents,
  rsvpEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.post("/", protect, isAdmin, createEvent);
router.put("/:id", protect, isAdmin, updateEvent);
router.get("/", protect, getAllEvents);
router.patch("/:id/rsvp", protect, rsvpEvent);
router.delete("/:id", protect, isAdmin, deleteEvent);

module.exports = router;
