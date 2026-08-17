const express = require("express");
const router = express.Router();
const {
  getPublicServices,
  getAllServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/auth");
const { uploadServiceImage } = require("../config/cloudinary");

// Public
router.get("/services", getPublicServices);

// Admin (protected)
router.get("/admin/services", protect, getAllServices);
router.post("/admin/services", protect, uploadServiceImage.single("image"), createService);
router.put("/admin/services/:id", protect, uploadServiceImage.single("image"), updateService);
router.delete("/admin/services/:id", protect, deleteService);

module.exports = router;
