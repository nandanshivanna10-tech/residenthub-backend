const Notification = require("../models/Notification");

const createNotification = async ({ userId, title, message, type, link }) => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type: type || "general",
      link: link || null,
    });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

module.exports = createNotification;
