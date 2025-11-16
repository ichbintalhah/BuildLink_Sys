const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    paymentMethod: {
      type: String,
      enum: ["JazzCash", "EasyPaisa", "Bank Transfer", "None"],
      default: "None",
    },
    paymentAccount: { type: String }, // This is the user's account number/phone
    cnic: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // We will hash this before saving
    role: {
      type: String,
      enum: ["user", "contractor", "admin"],
      default: "user",
    },
    profileImage: { type: String }, // This will be a URL to the image
  },
  { timestamps: true }
); // timestamps adds 'createdAt' and 'updatedAt' fields

// This is a common change from your blueprint:
// Instead of saving 'passwordHash', we save 'password'.
// We will use a special 'pre-save' hook to automatically
// hash (encrypt) the password *before* it gets saved to the database.
// This is a more modern and secure practice.

const User = mongoose.model("User", userSchema);
module.exports = User;
