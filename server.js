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

// 1. Connect Database
connectDB();

// 2. Configure Explicit CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL // https://residenthub-portal.onrender.com
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl/Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Origin not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Health check endpoint
app.get("/", (req, res) => {
  res.send("ResidentHub API is running");
});

// API Routes
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

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
