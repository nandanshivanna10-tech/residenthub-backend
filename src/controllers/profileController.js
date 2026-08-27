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

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.emergencyContact = emergencyContact || user.emergencyContact;
    user.vehicleNumber = vehicleNumber || user.vehicleNumber;
    user.parkingSlot = parkingSlot || user.parkingSlot;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
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
    res.status(500).json({ message: "Failed to update profile picture", error: error.message });
  }
};

exports.updateNotificationPrefs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { emailMaintenance, emailAnnouncements, emailBills, pushVisitors, pushEvents } = req.body;

    user.notificationPrefs = {
      emailMaintenance: emailMaintenance !== undefined ? emailMaintenance : user.notificationPrefs.emailMaintenance,
      emailAnnouncements: emailAnnouncements !== undefined ? emailAnnouncements : user.notificationPrefs.emailAnnouncements,
      emailBills: emailBills !== undefined ? emailBills : user.notificationPrefs.emailBills,
      pushVisitors: pushVisitors !== undefined ? pushVisitors : user.notificationPrefs.pushVisitors,
      pushEvents: pushEvents !== undefined ? pushEvents : user.notificationPrefs.pushEvents,
    };

    await user.save();
    res.status(200).json(user.notificationPrefs);
  } catch (error) {
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
    res.status(500).json({ message: "Failed to fetch profile stats", error: error.message });
  }
};
