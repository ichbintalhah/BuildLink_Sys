const mongoose = require("mongoose");

// This defines the structure for a single team member
const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skill: { type: String, required: true },
});

const contractorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    cnic: { type: String },
    address: { type: String },
    paymentMethod: { type: String }, // e.g., 'JazzCash', 'EasyPaisa'
    paymentAccount: { type: String }, // The contractor's account number/phone

    // This is an array of team members using the schema we defined above
    team: [teamMemberSchema],

    // This is an array of simple strings (e.g., ["Plumber", "Carpenter"])
    // We will fill this automatically based on their team's skills
    skills: [String],

    portfolio: [String], // An array of URLs to their "Previous Work" images

    rating: { type: Number, default: 0 },

    // Admin-applied tags (e.g., "Trusted", "Less Trusted")
    tags: [String],

    password: { type: String, required: true }, // We will hash this before saving

    role: { type: String, default: "contractor" },
    profileImage: { type: String }, // URL to their profile picture
  },
  { timestamps: true }
);

// Note: Just like with the User, we will hash the 'password' field
// before saving it to the database for security.

const Contractor = mongoose.model("Contractor", contractorSchema);
module.exports = Contractor;
