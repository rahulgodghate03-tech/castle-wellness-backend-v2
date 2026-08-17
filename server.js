require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const packageRoutes = require("./routes/packageRoutes");
const galleryRoutes = require("./routes/galleryRoutes");

const app = express();

connectDB();

// --- Core middleware ---
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Security middleware ---
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting on auth routes only — no custom keyGenerator, so we avoid
// the IPv6 key-gen crash that comes from hand-rolling req.ip handling.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth/login", authLimiter);

// --- Routes ---
app.get("/", (req, res) => res.json({ success: true, message: "Castle Wellness API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api", businessRoutes);
app.use("/api", serviceRoutes);
app.use("/api", packageRoutes);
app.use("/api", galleryRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Castle Wellness API running on port ${PORT}`));
