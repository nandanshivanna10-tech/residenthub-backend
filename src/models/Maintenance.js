const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["Plumbing", "Electrical", "Carpentry", "Appliance Repair", "General"],
      required: true,
    },
    description: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
