const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    const { title, category, description, organizer, date, location, imageUrl } = req.body;

    if (!title || !category || !description || !date || !location) {
      return res.status(400).json({ message: "Title, category, description, date, and location are required" });
    }

    const event = await Event.create({
      title,
      category,
      description,
      organizer,
      date,
      location,
      imageUrl,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to create event", error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const { filter } = req.query;
    const now = new Date();
    let query = {};

    if (filter === "Upcoming") {
      query.date = { $gte: now };
    } else if (filter === "Past") {
      query.date = { $lt: now };
    } else if (filter === "My Events") {
      query.attendees = req.user.id;
    }

    const events = await Event.find(query).sort({ date: 1 });

    const eventsWithFlags = events.map((e) => ({
      ...e.toObject(),
      isRegistered: e.attendees.some((a) => a.toString() === req.user.id),
      attendeeCount: e.attendees.length,
    }));

    res.status(200).json(eventsWithFlags);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const { title, category, description, organizer, date, location, imageUrl } = req.body;

    event.title = title || event.title;
    event.category = category || event.category;
    event.description = description || event.description;
    event.organizer = organizer || event.organizer;
    event.date = date || event.date;
    event.location = location || event.location;
    event.imageUrl = imageUrl || event.imageUrl;

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to update event", error: error.message });
  }
};

exports.rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyRegistered = event.attendees.some((a) => a.toString() === req.user.id);

    if (alreadyRegistered) {
      event.attendees = event.attendees.filter((a) => a.toString() !== req.user.id);
      await event.save();
      return res.status(200).json({ message: "RSVP cancelled", isRegistered: false });
    }

    event.attendees.push(req.user.id);
    await event.save();
    res.status(200).json({ message: "RSVP successful", isRegistered: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to RSVP", error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
};
