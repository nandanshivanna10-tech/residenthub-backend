const express = require("express");
const router = express.Router();
const { getDirectory, getDirectoryEntry } = require("../controllers/directoryController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getDirectory);
router.get("/:id", getDirectoryEntry);

module.exports = router;
