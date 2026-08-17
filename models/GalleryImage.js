const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    caption: { type: String, trim: true, default: "" },
    category: {
      type: String,
      enum: ["ambiance", "suite", "treatment", "other"],
      default: "other",
    },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryImage", galleryImageSchema);
