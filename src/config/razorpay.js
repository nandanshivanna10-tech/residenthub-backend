const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.rzp_test_TV4IaxsnA21XZq,
  key_secret: process.env.7QttT3LglMeC4pyN2NvllRgS,
});

module.exports = razorpayInstance;