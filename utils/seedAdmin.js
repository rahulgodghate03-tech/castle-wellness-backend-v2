// One-time script to create the first admin login.
// Run with: node utils/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("Admin already exists with this email:", email);
    process.exit(0);
  }

  const admin = await Admin.create({
    name: "Castle Wellness Admin",
    email,
    password,
    role: "superadmin",
  });

  console.log("Admin created successfully:", admin.email);
  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
