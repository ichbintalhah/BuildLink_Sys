require("dotenv").config(); // This loads your .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Route imports
const authRoutes = require("./routes/auth");
const contractorRoutes = require("./routes/contractor");
const jobRoutes = require("./routes/job");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");
//const chatRoutes = require("./routes/chat"); // Still commented out

const app = express();

// --- ADDED Global Request Logger ---
// This runs for EVERY request first
app.use((req, res, next) => {
  console.log(`>>> Incoming Request: ${req.method} ${req.path}`);
  next(); // Pass the request to the next middleware
});
// -----------------------------------

// --- Other Middlewares ---
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/contractors", contractorRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
//app.use("/api/chat", chatRoutes); // Still commented out

// A simple test route
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date() });
});

const PORT = process.env.PORT || 5000;

// --- Database Connection and Server Start ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });
