const Razorpay = require("razorpay");

let razorpayInstance = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.warn("Failed to initialize Razorpay:", err.message);
    razorpayInstance = null;
  }
} else {
  console.warn("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set. Payment features disabled.");
}

module.exports = razorpayInstance;
