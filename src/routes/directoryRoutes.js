const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getDirectory, getResidentById } = require("../controllers/directoryController");

router.get("/", protect, getDirectory);
router.get("/:id", protect, getResidentById);

module.exports = router;
