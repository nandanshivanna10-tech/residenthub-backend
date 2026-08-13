const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["resident", "admin", "security"], default: "resident" },
    tower: { type: String },
    unit: { type: String },
    status: { type: String, enum: ["owner", "tenant"], default: "owner" },
    emergencyContact: { type: String },
    vehicleNumber: { type: String },
    parkingSlot: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
