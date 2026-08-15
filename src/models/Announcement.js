const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Notice", "Alert", "Event"],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    postedBy: { type: String, required: true },
    postedByUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
