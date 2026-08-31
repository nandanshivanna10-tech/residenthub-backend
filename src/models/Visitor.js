const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String },
    countryCode: { type: String, default: "+91" },
    purpose: { type: String },
    vehicleNumber: { type: String },
    expectedAt: { type: Date },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    status: {
      type: String,
      enum: ["Expected", "Checked In", "Checked Out", "Revoked"],
      default: "Expected",
    },
    qrCode: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
