const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", protect, isAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
