// One-time migration: creates the "Castle Wellness" business record (if it
// doesn't exist) and links any existing Service/Package/GalleryImage
// documents (added before the multi-business update) to it.
// Run with: node utils/migrateToBusiness.js
require("dotenv").config();
const mongoose = require("mongoose");
const Business = require("../models/Business");
const Service = require("../models/Service");
const Package = require("../models/Package");
const GalleryImage = require("../models/GalleryImage");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  let business = await Business.findOne({ slug: "castle-wellness" });

  if (!business) {
    business = await Business.create({
      name: "Castle Wellness",
      slug: "castle-wellness",
      type: "spa",
      tagline: "A quieter kind of luxury.",
      description:
        "A private spa retreat in Trilanga, Bhopal — Balinese, Swedish and deep tissue therapies in a quiet, unhurried setting.",
      phone: "+91 73895 69421",
      whatsappNumber: "917389569421",
      address: "A/44, B/44 Sahkar Nagar, Trilanga, Bhopal – 462039, Madhya Pradesh",
      sortOrder: 0,
    });
    console.log("Created Business: Castle Wellness ->", business._id);
  } else {
    console.log("Castle Wellness business already exists ->", business._id);
  }

  const serviceResult = await Service.updateMany(
    { business: { $exists: false } },
    { $set: { business: business._id } }
  );
  const packageResult = await Package.updateMany(
    { business: { $exists: false } },
    { $set: { business: business._id } }
  );
  const galleryResult = await GalleryImage.updateMany(
    { business: { $exists: false } },
    { $set: { business: business._id } }
  );

  console.log(`Linked ${serviceResult.modifiedCount} service(s) to Castle Wellness`);
  console.log(`Linked ${packageResult.modifiedCount} package(s) to Castle Wellness`);
  console.log(`Linked ${galleryResult.modifiedCount} gallery image(s) to Castle Wellness`);
  console.log("Migration complete.");

  process.exit(0);
};

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
