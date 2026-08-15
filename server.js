require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const maintenanceRoutes = require("./src/routes/maintenanceRoutes");
const visitorRoutes = require("./src/routes/visitorRoutes");
const announcementRoutes = require("./src/routes/announcementRoutes");
const billRoutes = require("./src/routes/billRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const directoryRoutes = require("./src/routes/directoryRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ResidentHub API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/directory", directoryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
