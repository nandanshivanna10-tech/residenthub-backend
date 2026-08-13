const asyncHandler = require("express-async-handler");
const Maintenance = require("../models/Maintenance");
const Visitor = require("../models/Visitor");
const Event = require("../models/Event");
const Bill = require("../models/Bill");
const Announcement = require("../models/Announcement");

// @desc    Dashboard summary: Pending Maintenance, Visitors Today, Upcoming Events, Bills Due
//          + Recent Announcements + Upcoming Events list
// @route   GET /api/dashboard
// @access  Private (resident)
const getDashboard = asyncHandler(async (req, res) => {
  const residentId = req.user._id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const now = new Date();

  const [pendingMaintenance, inProgressCount, visitorsToday, nextVisitor, upcomingEvents, unpaidBills] =
    await Promise.all([
      Maintenance.countDocuments({ resident: residentId, status: { $in: ["Pending", "In Progress"] } }),
      Maintenance.countDocuments({ resident: residentId, status: "In Progress" }),
      Visitor.countDocuments({
        resident: residentId,
        expectedDateTime: { $gte: startOfDay, $lte: endOfDay },
      }),
      Visitor.findOne({
        resident: residentId,
        expectedDateTime: { $gte: now, $lte: endOfDay },
      }).sort({ expectedDateTime: 1 }),
      Event.find({ date: { $gte: now }, attendees: residentId }).sort({ date: 1 }).limit(5),
      Bill.find({ resident: residentId, status: "Unpaid" }).sort({ dueDate: 1 }),
    ]);

  const recentAnnouncements = await Announcement.find().sort({ createdAt: -1 }).limit(3);

  const totalDue = unpaidBills.reduce((sum, b) => sum + b.amount, 0);
  const nextBillDue = unpaidBills[0];

  res.json({
    success: true,
    data: {
      greetingName: req.user.fullName.split(" ")[0],
      cards: {
        pendingMaintenance: { count: pendingMaintenance, inProgress: inProgressCount },
        visitorsToday: {
          count: visitorsToday,
          nextExpectedTime: nextVisitor?.expectedDateTime || null,
        },
        upcomingEvents: {
          count: upcomingEvents.length,
          nextEventTitle: upcomingEvents[0]?.title || null,
        },
        billsDue: {
          count: unpaidBills.length,
          totalAmount: totalDue,
          daysUntilDue: nextBillDue
            ? Math.ceil((new Date(nextBillDue.dueDate) - now) / (1000 * 60 * 60 * 24))
            : null,
        },
      },
      recentAnnouncements,
      upcomingEvents,
    },
  });
});

module.exports = { getDashboard };
