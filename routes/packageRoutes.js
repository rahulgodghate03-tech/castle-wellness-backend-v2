const express = require("express");
const router = express.Router();
const {
  getPublicPackages,
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/packageController");
const { protect } = require("../middleware/auth");

// Public
router.get("/packages", getPublicPackages);

// Admin (protected)
router.get("/admin/packages", protect, getAllPackages);
router.post("/admin/packages", protect, createPackage);
router.put("/admin/packages/:id", protect, updatePackage);
router.delete("/admin/packages/:id", protect, deletePackage);

module.exports = router;
