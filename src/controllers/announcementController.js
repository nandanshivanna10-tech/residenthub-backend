const Announcement = require("../models/Announcement");

exports.createAnnouncement = async (req, res) => {
  try {
    const { type, title, description, postedBy } = req.body;

    if (!type || !title || !description || !postedBy) {
      return res.status(400).json({ message: "Type, title, description, and postedBy are required" });
    }

    const announcement = await Announcement.create({
      type,
      title,
      description,
      postedBy,
      postedByUser: req.user.id,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: "Failed to create announcement", error: error.message });
  }
};

exports.getAllAnnouncements = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type && type !== "All" ? { type } : {};

    const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch announcements", error: error.message });
  }
};

exports.getRecentAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(3);
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent announcements", error: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    await announcement.deleteOne();
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete announcement", error: error.message });
  }
};
