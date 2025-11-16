const Contractor = require("../models/Contractor");

// --- PUBLIC ---
// Finds all contractors who have a specific skill
// This is for your "Contractor Listings Page"
exports.getContractorsBySkill = async (req, res) => {
  try {
    const { skill } = req.params;

    // Find all contractors where the 'skills' array contains the skill from the URL
    // We use a case-insensitive search
    const contractors = await Contractor.find({
      skills: { $regex: new RegExp(`^${skill}$`, "i") },
    }).select("-password"); // .select('-password') means "don't include the password"

    res.status(200).json(contractors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- PUBLIC ---
// Gets one single contractor by their ID
// This is for your "Contractor Profile Page"
exports.getContractorById = async (req, res) => {
  try {
    const { id } = req.params;
    const contractor = await Contractor.findById(id).select("-password");

    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    res.status(200).json(contractor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
