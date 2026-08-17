const express = require("express");
const router = express.Router();
const {
  getPublicBusinesses,
  getBusinessBySlug,
  getAllBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/businessController");
const { protect } = require("../middleware/auth");
const { uploadBusinessImages } = require("../config/cloudinary");

const imageFields = uploadBusinessImages.fields([
  { name: "logo", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

// Public
router.get("/businesses", getPublicBusinesses);
router.get("/businesses/:slug", getBusinessBySlug);

// Admin (protected)
router.get("/admin/businesses", protect, getAllBusinesses);
router.post("/admin/businesses", protect, imageFields, createBusiness);
router.put("/admin/businesses/:id", protect, imageFields, updateBusiness);
router.delete("/admin/businesses/:id", protect, deleteBusiness);

module.exports = router;
