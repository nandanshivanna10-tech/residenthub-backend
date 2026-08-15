const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
    paidOn: { type: Date },
    transactionId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
