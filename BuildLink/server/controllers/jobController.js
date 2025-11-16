const Job = require("../models/Job");

// --- ADMIN-ONLY (but we need it for testing) ---
// Creates a new job in the database
exports.createJob = async (req, res) => {
  try {
    // We'll just pass in all the data from the request body
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- PUBLIC ---
// Gets all jobs (e.g., for the "Services" page)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- PUBLIC ---
// Gets all jobs belonging to a specific sub-category (e.g., all "Carpenter" jobs)
exports.getJobsBySubCategory = async (req, res) => {
  try {
    const { subCategory } = req.params;
    // Find all jobs where the subCategory matches the one in the URL
    // We use a case-insensitive search to be safe
    const jobs = await Job.find({
      subCategory: { $regex: new RegExp(`^${subCategory}$`, "i") },
    });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
