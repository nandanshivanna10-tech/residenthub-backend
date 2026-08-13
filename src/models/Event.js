const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Cultural", "Health & Wellness", "Sports", "Social", "Meeting", "Other"],
      default: "Other",
    },
    organizedBy: { type: String, required: true }, // "Cultural Society Board"
    imageUrl: { type: String, default: "" },

    date: { type: Date, required: true },
    venue: { type: String, required: true },

    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

eventSchema.virtual("attendeeCount").get(function () {
  return this.attendees ? this.attendees.length : 0;
});
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);
