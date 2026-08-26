const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  updateProfilePicture,
  getProfileStats,
} = require("../controllers/profileController");

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.put("/picture", protect, updateProfilePicture);
router.get("/stats", protect, getProfileStats);

module.exports = router;
