const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getProfile, updateProfile, getProfileStats } = require("../controllers/profileController");

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.get("/stats", protect, getProfileStats);

module.exports = router;
