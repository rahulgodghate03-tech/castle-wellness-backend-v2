const GalleryImage = require("../models/GalleryImage");
const Business = require("../models/Business");
const { cloudinary } = require("../config/cloudinary");

// GET /api/gallery?business=castle-wellness (public - active only, scoped to one business)
const getPublicGallery = async (req, res) => {
  try {
    const { business: slug } = req.query;
    if (!slug) {
      return res.status(400).json({ success: false, message: "Query param 'business' (slug) is required" });
    }

    const business = await Business.findOne({ slug, isActive: true });
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    const images = await GalleryImage.find({ business: business._id, isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: images.length, images });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch gallery", error: err.message });
  }
};

// GET /api/admin/gallery?business=<businessId>
const getAllGalleryImages = async (req, res) => {
  try {
    const { business } = req.query;
    const filter = business ? { business } : {};
    const images = await GalleryImage.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: images.length, images });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch gallery", error: err.message });
  }
};

// POST /api/admin/gallery
const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const { business, caption, category, sortOrder } = req.body;
    if (!business) {
      return res.status(400).json({ success: false, message: "Business is required" });
    }

    const image = await GalleryImage.create({
      business,
      caption,
      category,
      sortOrder,
      image: { url: req.file.path, publicId: req.file.filename },
    });

    res.status(201).json({ success: true, image });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to upload image", error: err.message });
  }
};

// PUT /api/admin/gallery/:id
const updateGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    const fields = ["caption", "category", "isActive", "sortOrder"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) image[field] = req.body[field];
    });

    if (req.file) {
      if (image.image?.publicId) {
        await cloudinary.uploader.destroy(image.image.publicId).catch(() => {});
      }
      image.image = { url: req.file.path, publicId: req.file.filename };
    }

    await image.save();
    res.status(200).json({ success: true, image });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update image", error: err.message });
  }
};

// DELETE /api/admin/gallery/:id
const deleteGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    if (image.image?.publicId) {
      await cloudinary.uploader.destroy(image.image.publicId).catch(() => {});
    }

    await image.deleteOne();
    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete image", error: err.message });
  }
};

module.exports = {
  getPublicGallery,
  getAllGalleryImages,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
};
