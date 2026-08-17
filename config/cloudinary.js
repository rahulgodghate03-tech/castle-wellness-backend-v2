const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generic storage factory so we can put different uploads into different
// Cloudinary folders (services, packages, gallery) without repeating code.
const makeStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `castle-wellness/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1600, crop: "limit", quality: "auto:good" }],
    },
  });

const uploadServiceImage = multer({ storage: makeStorage("services") });
const uploadPackageImage = multer({ storage: makeStorage("packages") });
const uploadGalleryImage = multer({ storage: makeStorage("gallery") });
const uploadBusinessImages = multer({ storage: makeStorage("businesses") });

module.exports = {
  cloudinary,
  uploadServiceImage,
  uploadPackageImage,
  uploadGalleryImage,
  uploadBusinessImages,
};
