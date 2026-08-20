// const Business = require("../models/Business");
// const { cloudinary } = require("../config/cloudinary");

// // GET /api/businesses (public - active only, used on MR Group homepage)
// const getPublicBusinesses = async (req, res) => {
//   try {
//     const businesses = await Business.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
//     res.status(200).json({ success: true, count: businesses.length, businesses });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to fetch businesses", error: err.message });
//   }
// };

// // GET /api/businesses/:slug (public - single business by slug, used on that business's pages)
// const getBusinessBySlug = async (req, res) => {
//   try {
//     const business = await Business.findOne({ slug: req.params.slug, isActive: true });
//     if (!business) {
//       return res.status(404).json({ success: false, message: "Business not found" });
//     }
//     res.status(200).json({ success: true, business });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to fetch business", error: err.message });
//   }
// };

// // GET /api/admin/businesses (admin - all, including inactive)
// const getAllBusinesses = async (req, res) => {
//   try {
//     const businesses = await Business.find().sort({ sortOrder: 1, createdAt: 1 });
//     res.status(200).json({ success: true, count: businesses.length, businesses });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to fetch businesses", error: err.message });
//   }
// };

// // POST /api/admin/businesses
// const createBusiness = async (req, res) => {
//   try {
//     const { name, type, tagline, description, phone, whatsappNumber, address, sortOrder } = req.body;

//     if (!name) {
//       return res.status(400).json({ success: false, message: "Business name is required" });
//     }

//     const businessData = { name, type, tagline, description, phone, whatsappNumber, address, sortOrder };

//     if (req.files?.logo?.[0]) {
//       businessData.logo = { url: req.files.logo[0].path, publicId: req.files.logo[0].filename };
//     }
//     if (req.files?.coverImage?.[0]) {
//       businessData.coverImage = { url: req.files.coverImage[0].path, publicId: req.files.coverImage[0].filename };
//     }

//     const business = await Business.create(businessData);
//     res.status(201).json({ success: true, business });
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(400).json({ success: false, message: "A business with a similar name already exists" });
//     }
//     res.status(500).json({ success: false, message: "Failed to create business", error: err.message });
//   }
// };

// // PUT /api/admin/businesses/:id
// const updateBusiness = async (req, res) => {
//   try {
//     const business = await Business.findById(req.params.id);
//     if (!business) {
//       return res.status(404).json({ success: false, message: "Business not found" });
//     }

//     const fields = ["name", "type", "tagline", "description", "phone", "whatsappNumber", "address", "isActive", "sortOrder"];
//     fields.forEach((field) => {
//       if (req.body[field] !== undefined) business[field] = req.body[field];
//     });

//     if (req.files?.logo?.[0]) {
//       if (business.logo?.publicId) await cloudinary.uploader.destroy(business.logo.publicId).catch(() => {});
//       business.logo = { url: req.files.logo[0].path, publicId: req.files.logo[0].filename };
//     }
//     if (req.files?.coverImage?.[0]) {
//       if (business.coverImage?.publicId) await cloudinary.uploader.destroy(business.coverImage.publicId).catch(() => {});
//       business.coverImage = { url: req.files.coverImage[0].path, publicId: req.files.coverImage[0].filename };
//     }

//     await business.save();
//     res.status(200).json({ success: true, business });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to update business", error: err.message });
//   }
// };

// // DELETE /api/admin/businesses/:id
// const deleteBusiness = async (req, res) => {
//   try {
//     const business = await Business.findById(req.params.id);
//     if (!business) {
//       return res.status(404).json({ success: false, message: "Business not found" });
//     }

//     if (business.logo?.publicId) await cloudinary.uploader.destroy(business.logo.publicId).catch(() => {});
//     if (business.coverImage?.publicId) await cloudinary.uploader.destroy(business.coverImage.publicId).catch(() => {});

//     await business.deleteOne();
//     res.status(200).json({ success: true, message: "Business deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to delete business", error: err.message });
//   }
// };

// module.exports = {
//   getPublicBusinesses,
//   getBusinessBySlug,
//   getAllBusinesses,
//   createBusiness,
//   updateBusiness,
//   deleteBusiness,
// };









const Business = require("../models/Business");
const { cloudinary } = require("../config/cloudinary");

const MAX_BUSINESSES = 3; // change this number only when you want to unlock a new business slot

// GET /api/businesses (public - active only, used on MR Group homepage)
const getPublicBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: businesses.length, businesses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch businesses", error: err.message });
  }
};

// GET /api/businesses/:slug (public - single business by slug, used on that business's pages)
const getBusinessBySlug = async (req, res) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug, isActive: true });
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }
    res.status(200).json({ success: true, business });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch business", error: err.message });
  }
};

// GET /api/admin/businesses (admin - all, including inactive)
const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().sort({ sortOrder: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: businesses.length, businesses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch businesses", error: err.message });
  }
};

// POST /api/admin/businesses
const createBusiness = async (req, res) => {
  try {
    const existingCount = await Business.countDocuments();
    if (existingCount >= MAX_BUSINESSES) {
      return res.status(403).json({
        success: false,
        message: "Business limit reached. Contact support to add a new business.",
      });
    }

    const { name, type, tagline, description, phone, whatsappNumber, address, sortOrder } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Business name is required" });
    }

    const businessData = { name, type, tagline, description, phone, whatsappNumber, address, sortOrder };

    if (req.files?.logo?.[0]) {
      businessData.logo = { url: req.files.logo[0].path, publicId: req.files.logo[0].filename };
    }
    if (req.files?.coverImage?.[0]) {
      businessData.coverImage = { url: req.files.coverImage[0].path, publicId: req.files.coverImage[0].filename };
    }

    const business = await Business.create(businessData);
    res.status(201).json({ success: true, business });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "A business with a similar name already exists" });
    }
    res.status(500).json({ success: false, message: "Failed to create business", error: err.message });
  }
};

// PUT /api/admin/businesses/:id
const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    const fields = ["name", "type", "tagline", "description", "phone", "whatsappNumber", "address", "isActive", "sortOrder"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) business[field] = req.body[field];
    });

    if (req.files?.logo?.[0]) {
      if (business.logo?.publicId) await cloudinary.uploader.destroy(business.logo.publicId).catch(() => {});
      business.logo = { url: req.files.logo[0].path, publicId: req.files.logo[0].filename };
    }
    if (req.files?.coverImage?.[0]) {
      if (business.coverImage?.publicId) await cloudinary.uploader.destroy(business.coverImage.publicId).catch(() => {});
      business.coverImage = { url: req.files.coverImage[0].path, publicId: req.files.coverImage[0].filename };
    }

    await business.save();
    res.status(200).json({ success: true, business });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update business", error: err.message });
  }
};

// DELETE /api/admin/businesses/:id
const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    if (business.logo?.publicId) await cloudinary.uploader.destroy(business.logo.publicId).catch(() => {});
    if (business.coverImage?.publicId) await cloudinary.uploader.destroy(business.coverImage.publicId).catch(() => {});

    await business.deleteOne();
    res.status(200).json({ success: true, message: "Business deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete business", error: err.message });
  }
};

module.exports = {
  getPublicBusinesses,
  getBusinessBySlug,
  getAllBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
};