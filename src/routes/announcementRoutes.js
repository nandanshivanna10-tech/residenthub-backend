const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createAnnouncement,
  getAllAnnouncements,
  getRecentAnnouncements,
  deleteAnnouncement,
} = require("../controllers/announcementController");

router.post("/", protect, createAnnouncement);
router.get("/", protect, getAllAnnouncements);
router.get("/recent", protect, getRecentAnnouncements);
router.delete("/:id", protect, deleteAnnouncement);

module.exports = router;
