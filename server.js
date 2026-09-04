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
const notificationRoutes = require("./src/routes/notificationRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (origin.endsWith(".onrender.com")) {
        return callback(null, true);
      }
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      if (origin.endsWith(".netlify.app")) {
        return callback(null, true);
      }
      console.log("Blocked by CORS: " + origin);
      return callback(new Error("CORS policy violation: Origin not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

app.get("/", (req, res) => {
  res.send("ResidentHub API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/directory", directoryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Server running on port " + PORT);
});
