const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const {
  getDirectory,
  getResidentById,
  createResident,
  updateResident,
  deleteResident,
} = require("../controllers/directoryController");

router.get("/", protect, getDirectory);
router.get("/:id", protect, getResidentById);
router.post("/", protect, isAdmin, createResident);
router.put("/:id", protect, isAdmin, updateResident);
router.delete("/:id", protect, isAdmin, deleteResident);

module.exports = router;
