const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tower: { type: String },
    unit: { type: String },

    billType: {
      type: String,
      enum: [
        "Maintenance Fee",
        "Water Meter Charge",
        "Electricity Charge",
        "Clubhouse Venue Booking Deposit",
        "Parking Fee",
        "Other",
      ],
      required: true,
    },
    description: { type: String, default: "" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    dueDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["Unpaid", "Paid", "Overdue"],
      default: "Unpaid",
    },

    // Filled once paid
    transactionId: { type: String },
    paymentDate: { type: Date },
    paymentMethod: { type: String, default: "" },
    receiptUrl: { type: String, default: "" },

    billingCycle: { type: String }, // e.g. "March 1"
  },
  { timestamps: true }
);

billSchema.index({ resident: 1, status: 1 });

module.exports = mongoose.model("Bill", billSchema);
