const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    type: {
      type: String,
      enum: ["Notice", "Alert", "Emergency Alert", "Society Event", "Event"],
      default: "Notice",
    },

    postedBy: { type: String, required: true }, // e.g. "Resident Welfare Association (RWA)"
    postedByUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    tower: { type: String, default: "All" }, // "All" or specific tower
    isPinned: { type: Boolean, default: false },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

announcementSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Announcement", announcementSchema);
