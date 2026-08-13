const express = require("express");
const router = express.Router();
const { getEvents, createEvent, rsvpEvent, cancelRsvp } = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getEvents).post(authorize("admin"), createEvent);
router.put("/:id/rsvp", rsvpEvent);
router.put("/:id/unrsvp", cancelRsvp);

module.exports = router;
