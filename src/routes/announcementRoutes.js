const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const {
  createAnnouncement,
  getAllAnnouncements,
  getRecentAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

router.post("/", protect, isAdmin, createAnnouncement);
router.get("/", protect, getAllAnnouncements);
router.get("/recent", protect, getRecentAnnouncements);
router.put("/:id", protect, isAdmin, updateAnnouncement);
router.delete("/:id", protect, isAdmin, deleteAnnouncement);

module.exports = router;
