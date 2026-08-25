const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getProfile,
  updateProfile,
  updateProfilePhoto,
  getProfileStats,
} = require("../controllers/profileController");

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.post("/photo", protect, upload.single("photo"), updateProfilePhoto);
router.get("/stats", protect, getProfileStats);

module.exports = router;
