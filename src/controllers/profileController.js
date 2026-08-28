const User = require("../models/User");
const Maintenance = require("../models/Maintenance");
const Visitor = require("../models/Visitor");
const Event = require("../models/Event");
const Bill = require("../models/Bill");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("getProfile error:", error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { fullName, email, phone, emergencyContact, vehicleNumber, parkingSlot } = req.body;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (emergencyContact) user.emergencyContact = emergencyContact;
    if (vehicleNumber) user.vehicleNumber = vehicleNumber;
    if (parkingSlot) user.parkingSlot = parkingSlot;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ message: "No image data provided" });
    }

    const sizeInBytes = (profilePicture.length * 3) / 4;
    const maxSizeInBytes = 15 * 1024 * 1024;
    if (sizeInBytes > maxSizeInBytes) {
      return res.status(400).json({ message: "Image too large. Please use an image under 15MB." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = profilePicture;
    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("updateProfilePicture error:", error);
    res.status(500).json({ message: "Failed to update profile picture", error: error.message });
  }
};

exports.updateNotificationPrefs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = user.notificationPrefs || {};
    const body = req.body || {};

    user.notificationPrefs = {
      emailMaintenance: body.emailMaintenance !== undefined ? body.emailMaintenance : existing.emailMaintenance,
      emailAnnouncements: body.emailAnnouncements !== undefined ? body.emailAnnouncements : existing.emailAnnouncements,
      emailBills: body.emailBills !== undefined ? body.emailBills : existing.emailBills,
      pushVisitors: body.pushVisitors !== undefined ? body.pushVisitors : existing.pushVisitors,
      pushEvents: body.pushEvents !== undefined ? body.pushEvents : existing.pushEvents,
    };

    await user.save();
    res.status(200).json(user.notificationPrefs);
  } catch (error) {
    console.error("updateNotificationPrefs error:", error);
    res.status(500).json({ message: "Failed to update notification preferences", error: error.message });
  }
};

exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const maintenanceCount = await Maintenance.countDocuments({ user: userId });
    const visitorsCount = await Visitor.countDocuments({ user: userId });
    const eventsAttended = await Event.countDocuments({ attendees: userId });
    const billsPaid = await Bill.countDocuments({ user: userId, status: "Paid" });

    res.status(200).json({
      maintenanceRequestsRaised: maintenanceCount,
      visitorsPreRegistered: visitorsCount,
      communityEventsAttended: eventsAttended,
      billsFullyPaid: billsPaid,
    });
  } catch (error) {
    console.error("getProfileStats error:", error);
    res.status(500).json({ message: "Failed to fetch profile stats", error: error.message });
  }
};
