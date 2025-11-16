const User = require("../models/User");
const Contractor = require("../models/Contractor");
const bcrypt = require("bcryptjs"); // For encrypting passwords
const jwt = require("jsonwebtoken"); // For creating "login tokens"

// A helper function to create a login token
const generateToken = (id, role) => {
  // We get the JWT_SECRET from your .env file
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d", // The token will expire in 7 days
  });
};

// --- SIGNUP LOGIC ---

exports.signupUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      paymentMethod,
      paymentAccount,
      cnic,
      email,
      password,
    } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // 2. Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user in database
    const user = await User.create({
      name,
      phone,
      address,
      paymentMethod,
      paymentAccount,
      cnic,
      email,
      password: hashedPassword, // Save the encrypted password
      role: "user",
    });

    // 4. Create a token and send it back
    const token = generateToken(user._id, user.role);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during user signup",
      error: error.message,
    });
  }
};

exports.signupContractor = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      paymentMethod,
      paymentAccount,
      cnic,
      email,
      password,
      team,
    } = req.body;

    // 1. Check if contractor already exists
    const contractorExists = await Contractor.findOne({ email });
    if (contractorExists) {
      return res
        .status(400)
        .json({ message: "Contractor with this email already exists" });
    }

    // 2. Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Get all unique skills from the team members (as per your blueprint)
    // We use a Set to avoid duplicates
    const skills = [...new Set(team.map((member) => member.skill))];

    // 4. Create new contractor in database
    const contractor = await Contractor.create({
      name,
      phone,
      address,
      paymentMethod,
      paymentAccount,
      cnic,
      email,
      password: hashedPassword, // Save the encrypted password
      team,
      skills, // Save the automatically generated skills list
      role: "contractor",
    });

    // 5. Create a token and send it back
    const token = generateToken(contractor._id, contractor.role);
    res.status(201).json({
      message: "Contractor registered successfully",
      token,
      user: {
        id: contractor._id,
        name: contractor.name,
        email: contractor.email,
        role: contractor.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during contractor signup",
      error: error.message,
    });
  }
};

// --- LOGIN LOGIC ---

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user (can be a 'User' or 'Contractor')
    // We check the User collection first
    let user = await User.findOne({ email });

    // If not found, check the Contractor collection
    if (!user) {
      user = await Contractor.findOne({ email });
    }

    // If still not found, the email is wrong
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Create a token and send it back
    const token = generateToken(user._id, user.role);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};
// --- GET USER PROFILE (for AuthContext) ---

exports.getMe = async (req, res) => {
  try {
    // 'req.user' is attached by our 'auth' middleware
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
