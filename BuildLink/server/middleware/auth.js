const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Contractor = require("../models/Contractor");

const auth = async (req, res, next) => {
  let token;

  // Check if the request has an 'Authorization' header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 1. Get the token from the header (it looks like "Bearer [token]")
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify the token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user or contractor based on the ID in the token
      // We attach this user info to the 'req' object
      // so our controllers can use it
      req.user =
        (await User.findById(decoded.id).select("-password")) ||
        (await Contractor.findById(decoded.id).select("-password"));

      if (!req.user) {
        throw new Error("User not found");
      }

      // 4. Move on to the next step (the actual controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = auth;
