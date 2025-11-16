// This middleware runs *after* the main 'auth' middleware
const adminAuth = (req, res, next) => {
  // --- ADDED LOG 1 ---
  console.log("--- ENTERING adminAuth middleware ---");
  console.log("User Role found by auth middleware:", req.user?.role);
  // --------------------

  if (req.user && req.user.role === "admin") {
    // --- ADDED LOG 2 (Success Case) ---
    console.log("--- Admin role confirmed, proceeding... ---");
    // ---------------------------------
    next(); // Let them proceed
  } else {
    // --- ADDED LOG 3 (Failure Case) ---
    console.error(
      "!!! ADMIN AUTH FAILED: User role is not admin or user object is missing."
    );
    // ---------------------------------
    res.status(403).json({ message: "Access denied. Admin-only route." });
  }
};

module.exports = adminAuth;
