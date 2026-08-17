const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Castle Wellness"
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // e.g. "castle-wellness" -> /castle-wellness
    type: { type: String, enum: ["spa", "salon", "other"], default: "other" },
    tagline: { type: String, trim: true, default: "" }, // short line shown on the MR Group homepage card
    description: { type: String, trim: true, default: "" }, // longer About text
    phone: { type: String, trim: true, default: "" },
    whatsappNumber: { type: String, trim: true, default: "" }, // digits only, e.g. 917389569421
    address: { type: String, trim: true, default: "" },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

businessSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Business", businessSchema);
