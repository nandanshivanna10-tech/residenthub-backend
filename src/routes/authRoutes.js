const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  getLoginActivity,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.put("/change-password", protect, changePassword);
router.get("/login-activity", protect, getLoginActivity);

module.exports = router;
