const Maintenance = require("../models/Maintenance");
const Visitor = require("../models/Visitor");
const Event = require("../models/Event");
const Bill = require("../models/Bill");
const Announcement = require("../models/Announcement");

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const pendingMaintenance = await Maintenance.countDocuments({
      user: userId,
      status: { $ne: "Completed" },
    });

    const expectedVisitors = await Visitor.countDocuments({
      user: userId,
      status: "Expected",
    });

    const upcomingEvents = await Event.find({ date: { $gte: now } })
      .sort({ date: 1 })
      .limit(2);

    const upcomingEventsCount = await Event.countDocuments({ date: { $gte: now } });

    const pendingBills = await Bill.find({ user: userId, status: "Unpaid" });
    const billsDueCount = pendingBills.length;
    const totalDueAmount = pendingBills.reduce((sum, b) => sum + b.amount, 0);

    const recentAnnouncements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      pendingMaintenance,
      visitorsToday: expectedVisitors,
      upcomingEventsCount,
      billsDueCount,
      totalDueAmount,
      upcomingEvents,
      recentAnnouncements,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard summary", error: error.message });
  }
};
