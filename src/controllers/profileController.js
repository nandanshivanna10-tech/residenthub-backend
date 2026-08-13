const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get own profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @desc    Update Personal Info tab (name, email, phone, emergency contact, vehicle, parking)
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const editable = ["fullName", "email", "phone", "vehicleNumber", "parkingSlot"];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  if (req.body.emergencyContact) {
    user.emergencyContact = { ...user.emergencyContact, ...req.body.emergencyContact };
  }

  await user.save();
  res.json({ success: true, data: user });
});

// @desc    Change password (Security tab)
// @route   PUT /api/profile/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("currentPassword and newPassword are required");
  }

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated successfully" });
});

// @desc    Update notification settings (Notifications tab)
// @route   PUT /api/profile/notifications
// @access  Private
const updateNotificationSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.notificationSettings = { ...user.notificationSettings, ...req.body };
  await user.save();
  res.json({ success: true, data: user.notificationSettings });
});

// @desc    Update preferences: currency (INR), language (EN/HI), theme (light/dark) - (Preferences tab)
// @route   PUT /api/profile/preferences
// @access  Private
const updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.preferences = { ...user.preferences, ...req.body };
  await user.save();
  res.json({ success: true, data: user.preferences });
});

// @desc    Add a family member
// @route   POST /api/profile/family
// @access  Private
const addFamilyMember = asyncHandler(async (req, res) => {
  const { name, relation, photoUrl } = req.body;
  if (!name || !relation) {
    res.status(400);
    throw new Error("name and relation are required");
  }

  const user = await User.findById(req.user._id);
  user.familyMembers.push({ name, relation, photoUrl });
  await user.save();
  res.status(201).json({ success: true, data: user.familyMembers });
});

// @desc    Remove a family member
// @route   DELETE /api/profile/family/:memberId
// @access  Private
const removeFamilyMember = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.familyMembers = user.familyMembers.filter(
    (m) => m._id.toString() !== req.params.memberId
  );
  await user.save();
  res.json({ success: true, data: user.familyMembers });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateNotificationSettings,
  updatePreferences,
  addFamilyMember,
  removeFamilyMember,
};
