// const mongoose = require("mongoose");

// const packageSchema = new mongoose.Schema(
//   {
//     business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
//     title: { type: String, required: true, trim: true }, // e.g. "20 Therapy Package"
//     therapyCount: { type: Number, required: true, min: 1 },
//     price: { type: Number, required: true, min: 0 },
//         discountPrice: { type: Number, default: null, min: 0 },
//     isFeatured: { type: Boolean, default: false }, // shows "Most Popular" tag
//     isActive: { type: Boolean, default: true },
//     sortOrder: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Package", packageSchema);







const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    title: { type: String, required: true, trim: true }, // e.g. "20 Therapy Package"
    subtitle: { type: String, trim: true, default: "" }, // flexible: "10 Sessions" or "5 Hair Cuts + Free Beard Trim"
    therapyCount: { type: Number, min: 1, default: null }, // optional now — spa uses this, salon may not
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null, min: 0 },
    isFeatured: { type: Boolean, default: false }, // shows "Most Popular" tag
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
