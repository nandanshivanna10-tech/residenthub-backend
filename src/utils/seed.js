// Run with: npm run seed
require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Maintenance = require("../models/Maintenance");
const Visitor = require("../models/Visitor");
const Announcement = require("../models/Announcement");
const Bill = require("../models/Bill");
const Event = require("../models/Event");

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany(),
    Maintenance.deleteMany(),
    Visitor.deleteMany(),
    Announcement.deleteMany(),
    Bill.deleteMany(),
    Event.deleteMany(),
  ]);

  console.log("Seeding users...");
  const rahul = await User.create({
    fullName: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 91234 56789",
    password: "password123",
    role: "resident",
    tower: "Tower B",
    unit: "402",
    residentStatus: "Owner",
    moveInDate: new Date("2023-08-15"),
    emergencyContact: { name: "Dev Sharma", phone: "+91 98765 43210" },
    vehicleNumber: "MH-12-AB-1234",
    parkingSlot: "B-402-P1 (Basement 1)",
    familyMembers: [
      { name: "Sunita Sharma", relation: "Mother" },
      { name: "Aman Sharma", relation: "Brother" },
    ],
  });

  await User.create({
    fullName: "Priya Patel",
    email: "priya.patel@gmail.com",
    phone: "+91 98234 56711",
    password: "password123",
    role: "resident",
    tower: "Tower A",
    unit: "201",
    residentStatus: "Tenant",
    moveInDate: new Date("2024-01-10"),
    emergencyContact: { name: "Dev Patel", phone: "" },
    vehicleNumber: "MH-12-PQ-9080",
  });

  await User.create({
    fullName: "Vikram Sen",
    email: "vikram.sen@gmail.com",
    phone: "+91 93456 78912",
    password: "password123",
    role: "resident",
    tower: "Tower C",
    unit: "105",
    residentStatus: "Owner",
    moveInDate: new Date("2022-11-05"),
  });

  await User.create({
    fullName: "Admin User",
    email: "admin@residenthub.com",
    phone: "+91 90000 00001",
    password: "admin12345",
    role: "admin",
  });

  await User.create({
    fullName: "Security Guard",
    email: "security@residenthub.com",
    phone: "+91 90000 00002",
    password: "security123",
    role: "security",
  });

  console.log("Seeding maintenance requests...");
  await Maintenance.create([
    {
      resident: rahul._id,
      tower: "Tower B",
      unit: "402",
      category: "Plumbing",
      description: "Severe water leakage in the master bedroom washroom pipe.",
      priority: "High",
      status: "Pending",
    },
    {
      resident: rahul._id,
      tower: "Tower B",
      unit: "402",
      category: "Electrical",
      description: "Short circuit triggered in the main hallway circuit breaker.",
      priority: "Medium",
      status: "In Progress",
    },
    {
      resident: rahul._id,
      tower: "Tower B",
      unit: "402",
      category: "Carpentry",
      description: "Kitchen cabinet door hinge broken and needs replacement.",
      priority: "Low",
      status: "In Progress",
    },
  ]);

  console.log("Seeding visitors...");
  await Visitor.create([
    {
      resident: rahul._id,
      tower: "Tower B",
      unit: "402",
      visitorName: "Anjali Sharma",
      visitorKind: "Family",
      relationOrService: "Family",
      purpose: "Weekend Visit",
      expectedDateTime: new Date("2026-02-14T11:00:00"),
      status: "Expected",
    },
    {
      resident: rahul._id,
      tower: "Tower B",
      unit: "402",
      visitorName: "Amazon Delivery",
      visitorKind: "Delivery",
      relationOrService: "E-Commerce",
      purpose: "Package Dropoff",
      expectedDateTime: new Date("2026-02-10T14:30:00"),
      status: "Expected",
    },
  ]);

  console.log("Seeding announcements...");
  await Announcement.create([
    {
      title: "Annual Fire Safety & Smoke Detector System Audit",
      description:
        "Attention Residents: The management and security team will execute an overall building system safety check tomorrow. Alarms will ring intermittently in blocks A and B between 1:00 PM and 4:00 PM.",
      type: "Emergency Alert",
      postedBy: "Resident Welfare Association (RWA)",
    },
    {
      title: "Upgrade of Gym Treadmills Complete inside Clubhouse",
      description:
        "We are pleased to inform that all outdated treadmills and exercise cycles in the health wing have been successfully swapped out for new high-performance gym stations.",
      type: "Notice",
      postedBy: "Sports & Gym Committee",
    },
    {
      title: "Community Holi Celebration 2026 - Registrations Open",
      description:
        "Let us get together to celebrate the vibrant colours of life and love! Registration for food stalls, cultural stage plays, and organic colors collection has kicked off.",
      type: "Society Event",
      postedBy: "Cultural Society Board",
    },
  ]);

  console.log("Seeding bills...");
  await Bill.create([
    {
      resident: rahul._id,
      tower: "Tower B",
      unit: "402",
      billType: "Maintenance Fee",
      amount: 9960,
      dueDate: new Date("2026-02-15"),
      status: "Unpaid",
      billingCycle: "March 1",
    },
    {
      resident: rahul._id,
      tower: "Tower B",
      unit: "402",
      billType: "Water Meter Charge",
      amount: 1536,
      dueDate: new Date("2026-02-15"),
      status: "Unpaid",
    },
    {
      resident: rahul._id,
      billType: "Maintenance Fee",
      amount: 9960,
      dueDate: new Date("2026-01-12"),
      status: "Paid",
      transactionId: "TXN-9021489",
      paymentDate: new Date("2026-01-12"),
    },
    {
      resident: rahul._id,
      billType: "Clubhouse Venue Booking Deposit",
      amount: 20750,
      dueDate: new Date("2026-01-05"),
      status: "Paid",
      transactionId: "TXN-8874102",
      paymentDate: new Date("2026-01-05"),
    },
  ]);

  console.log("Seeding events...");
  await Event.create([
    {
      title: "Holi Celebration 2026",
      description:
        "Join us for the ultimate community festival of colors! Includes organic color distribution, sweet stalls, cultural dances, and live DJ performance.",
      category: "Cultural",
      organizedBy: "Cultural Society Board",
      date: new Date("2026-03-15T16:00:00"),
      venue: "Clubhouse Lawn",
    },
    {
      title: "Yoga & Wellness Workshop",
      description:
        "A rejuvenating morning of deep breathing, therapeutic stretching, and mindfulness meditation led by certified professional instructors.",
      category: "Health & Wellness",
      organizedBy: "Health Committee",
      date: new Date("2026-02-20T07:00:00"),
      venue: "Terrace Garden",
      attendees: [rahul._id],
    },
  ]);

  console.log("Seed complete!");
  console.log("\nTest logins:");
  console.log("  Resident: rahul.sharma@gmail.com / password123");
  console.log("  Admin:    admin@residenthub.com / admin12345");
  console.log("  Security: security@residenthub.com / security123");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
