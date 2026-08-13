const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  updateNotificationSettings,
  updatePreferences,
  addFamilyMember,
  removeFamilyMember,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getProfile).put(updateProfile);
router.put("/password", changePassword);
router.put("/notifications", updateNotificationSettings);
router.put("/preferences", updatePreferences);
router.post("/family", addFamilyMember);
router.delete("/family/:memberId", removeFamilyMember);

module.exports = router;
