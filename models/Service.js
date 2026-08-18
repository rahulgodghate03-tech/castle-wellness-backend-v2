const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
        discountPrice: { type: Number, default: null, min: 0 },
    durationMinutes: { type: Number, default: 60 },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// slug only needs to be unique *within* a business, not globally —
// two different businesses can each have a "Deep Tissue Massage".
serviceSchema.index({ business: 1, slug: 1 }, { unique: true });

serviceSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Service", serviceSchema);
