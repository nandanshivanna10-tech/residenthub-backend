const Maintenance = require("../models/Maintenance");
const Visitor = require("../models/Visitor");
const Event = require("../models/Event");
const Bill = require("../models/Bill");
const Announcement = require("../models/Announcement");
const User = require("../models/User");

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

exports.getAdminDashboardSummary = async (req, res) => {
  try {
    const now = new Date();

    const totalResidents = await User.countDocuments({ role: "resident" });

    const pendingMaintenanceCount = await Maintenance.countDocuments({ status: { $ne: "Completed" } });
    const inProgressMaintenanceCount = await Maintenance.countDocuments({ status: "In Progress" });

    const expectedVisitorsCount = await Visitor.countDocuments({ status: "Expected" });
    const checkedInVisitorsCount = await Visitor.countDocuments({ status: "Checked In" });

    const upcomingEventsCount = await Event.countDocuments({ date: { $gte: now } });

    const unpaidBills = await Bill.find({ status: "Unpaid" });
    const unpaidBillsCount = unpaidBills.length;
    const totalOutstandingAmount = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

    const recentMaintenance = await Maintenance.find()
      .populate("user", "fullName tower unit")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentVisitors = await Visitor.find()
      .populate("user", "fullName tower unit")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentAnnouncements = await Announcement.find().sort({ createdAt: -1 }).limit(3);

    res.status(200).json({
      totalResidents,
      pendingMaintenanceCount,
      inProgressMaintenanceCount,
      expectedVisitorsCount,
      checkedInVisitorsCount,
      upcomingEventsCount,
      unpaidBillsCount,
      totalOutstandingAmount,
      recentMaintenance,
      recentVisitors,
      recentAnnouncements,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin dashboard summary", error: error.message });
  }
};
