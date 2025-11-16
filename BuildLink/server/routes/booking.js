const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/auth"); // Our "gatekeeper" middleware
const upload = require("../middleware/upload"); // Our file upload handler

// --- DASHBOARD ROUTES (to get data) ---
// These must be *before* routes with /:id
// @route   GET /api/bookings/mybookings
// @desc    Get all bookings for the logged-in User
router.get("/mybookings", auth, bookingController.getUserBookings);

// @route   GET /api/bookings/contractorbookings
// @desc    Get all bookings for the logged-in Contractor
router.get(
  "/contractorbookings",
  auth,
  bookingController.getContractorBookings
);

// --- ACTION ROUTES (to make changes) ---

// @route   POST /api/bookings/request
// @desc    (USER) Request a new booking
router.post("/request", auth, bookingController.requestBooking);

// @route   POST /api/bookings/:id/accept
// @desc    (CONTRACTOR) Accept a booking
router.post("/:id/accept", auth, bookingController.acceptBooking);

// @route   POST /api/bookings/:id/reject
// @desc    (CONTRACTOR) Reject a booking
router.post("/:id/reject", auth, bookingController.rejectBooking);

// @route   POST /api/bookings/:id/upload-payment
// @desc    (USER) Upload a payment screenshot (1 file)
router.post(
  "/:id/upload-payment",
  auth,
  upload.single("paymentScreenshot"), // 'paymentScreenshot' is the field name
  bookingController.uploadPaymentScreenshot
);

// @route   POST /api/bookings/:id/upload-work
// @desc    (CONTRACTOR) Upload work photos (up to 6)
router.post(
  "/:id/upload-work",
  auth,
  upload.array("workPhotos", 6), // 'workPhotos' is the field name, 6 is the max
  bookingController.uploadWorkPhotos
);

// @route   POST /api/bookings/:id/complete
// @desc    (USER) Mark the job as complete
router.post("/:id/complete", auth, bookingController.markJobAsComplete);

// @route   POST /api/bookings/:id/dispute
// @desc    (USER) File a dispute (up to 2 photos)
router.post(
  "/:id/dispute",
  auth,
  upload.array("disputePhotos", 2), // 'disputePhotos' is the field name, 2 is the max
  bookingController.fileDispute
);

module.exports = router;
