const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createEvent,
  getAllEvents,
  rsvpEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.post("/", protect, createEvent);
router.get("/", protect, getAllEvents);
router.patch("/:id/rsvp", protect, rsvpEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;
