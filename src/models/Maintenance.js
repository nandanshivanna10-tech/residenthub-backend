const mongoose = require("mongoose");
const Counter = require("./Counter");

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const maintenanceSchema = new mongoose.Schema(
  {
    requestId: { type: String, unique: true }, // e.g. "REQ-1049"
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tower: { type: String },
    unit: { type: String },

    category: {
      type: String,
      enum: ["Plumbing", "Electrical", "Carpentry", "Appliance Repair", "General"],
      required: true,
    },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Cancelled"],
      default: "Pending",
    },
    assignedTo: { type: String, default: "" }, // staff/vendor name
    comments: [commentSchema],
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

maintenanceSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "maintenanceRequest" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.requestId = `REQ-${1000 + counter.seq}`;
  }
  next();
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);
