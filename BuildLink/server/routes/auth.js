const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth"); // Import the middleware

// @route   POST /api/auth/signup/user
// @desc    Register a new user
// (No 'auth' middleware here, because new users aren't logged in)
router.post("/signup/user", authController.signupUser);

// @route   POST /api/auth/signup/contractor
// @desc    Register a new contractor
// (No 'auth' middleware here)
router.post("/signup/contractor", authController.signupContractor);

// @route   POST /api/auth/login
// @desc    Login for both users and contractors
// (No 'auth' middleware here)
router.post("/login", authController.login);

// @route   GET /api/auth/me
// @desc    Get the profile of the logged-in user
// (We *DO* use the 'auth' middleware here to protect the route)
router.get("/me", auth, authController.getMe);

module.exports = router;
