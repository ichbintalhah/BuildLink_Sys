const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth"); // Gate 1: Are they logged in?
const adminAuth = require("../middleware/adminAuth"); // Gate 2: Are they an admin?

// We chain the middleware: run 'auth' first, then 'adminAuth'
const adminOnly = [auth, adminAuth];

// @route   GET /api/admin/pending-payments
// @desc    (ADMIN) Get all bookings awaiting payment confirmation
router.get("/pending-payments", adminOnly, adminController.getPendingPayments);

// @route   GET /api/admin/disputes
// @desc    (ADMIN) Get all bookings in dispute
router.get("/disputes", adminOnly, adminController.getDisputedBookings);

// @route   POST /api/admin/confirm-payment/:id
// @desc    (ADMIN) Confirm a payment for a booking
router.post("/confirm-payment/:id", adminOnly, adminController.confirmPayment);

// @route   POST /api/admin/resolve-dispute/:id
// @desc    (ADMIN) Resolve a dispute for a booking
router.post("/resolve-dispute/:id", adminOnly, adminController.resolveDispute);

module.exports = router;
