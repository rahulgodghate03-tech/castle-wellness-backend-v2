// const Service = require("../models/Service");
// const Business = require("../models/Business");
// const { cloudinary } = require("../config/cloudinary");

// // GET /api/services?business=castle-wellness  (public - active only, scoped to one business)
// const getPublicServices = async (req, res) => {
//   try {
//     const { business: slug } = req.query;
//     if (!slug) {
//       return res.status(400).json({ success: false, message: "Query param 'business' (slug) is required" });
//     }

//     const business = await Business.findOne({ slug, isActive: true });
//     if (!business) {
//       return res.status(404).json({ success: false, message: "Business not found" });
//     }

//     const services = await Service.find({ business: business._id, isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
//     res.status(200).json({ success: true, count: services.length, services });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to fetch services", error: err.message });
//   }
// };

// // GET /api/admin/services?business=<businessId>  (admin - all, including inactive, scoped to one business)
// const getAllServices = async (req, res) => {
//   try {
//     const { business } = req.query;
//     const filter = business ? { business } : {};
//     const services = await Service.find(filter).sort({ sortOrder: 1, createdAt: 1 });
//     res.status(200).json({ success: true, count: services.length, services });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to fetch services", error: err.message });
//   }
// };

// // POST /api/admin/services
// const createService = async (req, res) => {
//   try {
//          const { business, name, description, price, discountPrice, durationMinutes, sortOrder } = req.body;

//     if (!business || !name || !description || !price) {
//       return res.status(400).json({ success: false, message: "Business, name, description and price are required" });
//     }

//        const serviceData = { business, name, description, price, discountPrice: discountPrice || null, durationMinutes, sortOrder };

//     if (req.file) {
//       serviceData.image = { url: req.file.path, publicId: req.file.filename };
//     }

//     const service = await Service.create(serviceData);
//     res.status(201).json({ success: true, service });
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(400).json({ success: false, message: "This business already has a service with a similar name" });
//     }
//     res.status(500).json({ success: false, message: "Failed to create service", error: err.message });
//   }
// };

// // PUT /api/admin/services/:id
// const updateService = async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//       return res.status(404).json({ success: false, message: "Service not found" });
//     }

//         const fields = ["name", "description", "price", "discountPrice", "durationMinutes", "sortOrder", "isActive"];
//     fields.forEach((field) => {
//       if (req.body[field] !== undefined) service[field] = req.body[field];
//     });

//     if (req.file) {
//       if (service.image?.publicId) {
//         await cloudinary.uploader.destroy(service.image.publicId).catch(() => {});
//       }
//       service.image = { url: req.file.path, publicId: req.file.filename };
//     }

//     await service.save();
//     res.status(200).json({ success: true, service });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to update service", error: err.message });
//   }
// };

// // DELETE /api/admin/services/:id
// const deleteService = async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//       return res.status(404).json({ success: false, message: "Service not found" });
//     }

//     if (service.image?.publicId) {
//       await cloudinary.uploader.destroy(service.image.publicId).catch(() => {});
//     }

//     await service.deleteOne();
//     res.status(200).json({ success: true, message: "Service deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to delete service", error: err.message });
//   }
// };

// module.exports = { getPublicServices, getAllServices, createService, updateService, deleteService };











const Service = require("../models/Service");
const Business = require("../models/Business");
const { cloudinary } = require("../config/cloudinary");

// GET /api/services?business=castle-wellness  (public - active only, scoped to one business)
const getPublicServices = async (req, res) => {
  try {
    const { business: slug } = req.query;
    if (!slug) {
      return res.status(400).json({ success: false, message: "Query param 'business' (slug) is required" });
    }

    const business = await Business.findOne({ slug, isActive: true });
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    const services = await Service.find({ business: business._id, isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: services.length, services });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch services", error: err.message });
  }
};

// GET /api/admin/services?business=<businessId>  (admin - all, including inactive, scoped to one business)
const getAllServices = async (req, res) => {
  try {
    const { business } = req.query;
    const filter = business ? { business } : {};
    const services = await Service.find(filter).sort({ sortOrder: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: services.length, services });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch services", error: err.message });
  }
};

// POST /api/admin/services
const createService = async (req, res) => {
  try {
    const { business, name, description, category, price, discountPrice, durationMinutes, sortOrder } = req.body;

    if (!business || !name || !description || !price) {
      return res.status(400).json({ success: false, message: "Business, name, description and price are required" });
    }

    const serviceData = { business, name, description, category, price, discountPrice: discountPrice || null, durationMinutes, sortOrder };

    if (req.file) {
      serviceData.image = { url: req.file.path, publicId: req.file.filename };
    }

    const service = await Service.create(serviceData);
    res.status(201).json({ success: true, service });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "This business already has a service with a similar name" });
    }
    res.status(500).json({ success: false, message: "Failed to create service", error: err.message });
  }
};

// PUT /api/admin/services/:id
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const fields = ["name", "description", "category", "price", "discountPrice", "durationMinutes", "sortOrder", "isActive"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) service[field] = req.body[field];
    });

    if (req.file) {
      if (service.image?.publicId) {
        await cloudinary.uploader.destroy(service.image.publicId).catch(() => {});
      }
      service.image = { url: req.file.path, publicId: req.file.filename };
    }

    await service.save();
    res.status(200).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update service", error: err.message });
  }
};

// DELETE /api/admin/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    if (service.image?.publicId) {
      await cloudinary.uploader.destroy(service.image.publicId).catch(() => {});
    }

    await service.deleteOne();
    res.status(200).json({ success: true, message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete service", error: err.message });
  }
};

module.exports = { getPublicServices, getAllServices, createService, updateService, deleteService };