const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    title: { type: String, required: true, trim: true }, // e.g. "20 Therapy Package"
    therapyCount: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
        discountPrice: { type: Number, default: null, min: 0 },
    isFeatured: { type: Boolean, default: false }, // shows "Most Popular" tag
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
