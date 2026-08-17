const express = require("express");
const router = express.Router();
const {
  getPublicGallery,
  getAllGalleryImages,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} = require("../controllers/galleryController");
const { protect } = require("../middleware/auth");
const { uploadGalleryImage: multerGallery } = require("../config/cloudinary");

// Public
router.get("/gallery", getPublicGallery);

// Admin (protected)
router.get("/admin/gallery", protect, getAllGalleryImages);
router.post("/admin/gallery", protect, multerGallery.single("image"), uploadGalleryImage);
router.put("/admin/gallery/:id", protect, multerGallery.single("image"), updateGalleryImage);
router.delete("/admin/gallery/:id", protect, deleteGalleryImage);

module.exports = router;
