const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const visitorSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tower: { type: String },
    unit: { type: String },

    visitorName: { type: String, required: true },
    phone: { type: String, default: "" },

    // "Relation: Family" or "Service: E-Commerce"
    visitorKind: {
      type: String,
      enum: ["Family", "Guest", "Service", "Delivery", "Contractor", "Other"],
      default: "Guest",
    },
    relationOrService: { type: String, default: "" }, // e.g. "Family", "E-Commerce"

    purpose: { type: String, required: true },
    expectedDateTime: { type: Date, required: true },
    vehicleNumber: { type: String, default: "" },
    photoUrl: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Expected", "Checked In", "Checked Out", "Revoked"],
      default: "Expected",
    },

    checkInTime: { type: Date },
    checkOutTime: { type: Date },

    qrCode: { type: String, default: () => uuidv4() },

    checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // security guard
    checkedOutBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

visitorSchema.index({ resident: 1, status: 1 });

module.exports = mongoose.model("Visitor", visitorSchema);
