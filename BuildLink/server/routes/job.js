const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
// We'll add 'auth' middleware later to protect the 'createJob' route

// @route   POST /api/jobs
// @desc    Create a new job (Admin only)
router.post("/", jobController.createJob);

// @route   GET /api/jobs
// @desc    Get all jobs
router.get("/", jobController.getAllJobs);

// @route   GET /api/jobs/category/:subCategory
// @desc    Get all jobs for a specific sub-category (e.g., /api/jobs/category/Carpenter)
router.get("/category/:subCategory", jobController.getJobsBySubCategory);

module.exports = router;
