const express = require("express");
const router = express.Router();
const contractorController = require("../controllers/contractorController");

// @route   GET /api/contractors/skill/:skill
// @desc    Get all contractors with a specific skill (e.g., /api/contractors/skill/Plumber)
router.get("/skill/:skill", contractorController.getContractorsBySkill);

// @route   GET /api/contractors/:id
// @desc    Get a single contractor's profile
router.get("/:id", contractorController.getContractorById);

module.exports = router;
