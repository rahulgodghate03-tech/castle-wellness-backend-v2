const Package = require("../models/Package");
const Business = require("../models/Business");

// GET /api/packages?business=castle-wellness (public - active only, scoped to one business)
const getPublicPackages = async (req, res) => {
  try {
    const { business: slug } = req.query;
    if (!slug) {
      return res.status(400).json({ success: false, message: "Query param 'business' (slug) is required" });
    }

    const business = await Business.findOne({ slug, isActive: true });
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    const packages = await Package.find({ business: business._id, isActive: true }).sort({ sortOrder: 1, therapyCount: 1 });
    res.status(200).json({ success: true, count: packages.length, packages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch packages", error: err.message });
  }
};

// GET /api/admin/packages?business=<businessId>
const getAllPackages = async (req, res) => {
  try {
    const { business } = req.query;
    const filter = business ? { business } : {};
    const packages = await Package.find(filter).sort({ sortOrder: 1, therapyCount: 1 });
    res.status(200).json({ success: true, count: packages.length, packages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch packages", error: err.message });
  }
};

// POST /api/admin/packages
const createPackage = async (req, res) => {
  try {
       const { business, title, therapyCount, price, discountPrice, isFeatured, sortOrder } = req.body;

    if (!business || !title || !therapyCount || !price) {
      return res.status(400).json({ success: false, message: "Business, title, therapyCount and price are required" });
    }

    // Only one featured package per business at a time.
    if (isFeatured) {
      await Package.updateMany({ business }, { $set: { isFeatured: false } });
    }

        const pkg = await Package.create({ business, title, therapyCount, price, isFeatured, sortOrder });
    res.status(201).json({ success: true, package: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create package", error: err.message });
  }
};

// PUT /api/admin/packages/:id
const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    if (req.body.isFeatured) {
      await Package.updateMany({ business: pkg.business, _id: { $ne: pkg._id } }, { $set: { isFeatured: false } });
    }

        const fields = ["title", "therapyCount", "price", "discountPrice", "isFeatured", "isActive", "sortOrder"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) pkg[field] = req.body[field];
    });

    await pkg.save();
    res.status(200).json({ success: true, package: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update package", error: err.message });
  }
};

// DELETE /api/admin/packages/:id
const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    await pkg.deleteOne();
    res.status(200).json({ success: true, message: "Package deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete package", error: err.message });
  }
};

module.exports = { getPublicPackages, getAllPackages, createPackage, updatePackage, deletePackage };
