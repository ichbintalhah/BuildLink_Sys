const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g., "Make Wooden Table"

    category: { type: String }, // e.g., "Renovation"

    subCategory: { type: String }, // e.g., "Carpenter"

    // This is the key field that links this job to a contractor's skill
    requiredSkill: { type: String, required: true }, // e.g., "Carpenter"

    adminFixedPrice: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
