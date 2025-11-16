const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema(
  {
    // --- The Core Links ---
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contractorId: { type: String, ref: "Contractor", required: true }, // Keep as String for mock IDs
    // For the current mock/frontend data we accept string job IDs like 'job10'.
    // If you migrate to using real Job documents (ObjectId _id), change this to Schema.Types.ObjectId.
    jobId: { type: String, ref: "Job", required: true },

    // --- Status and Price ---
    status: {
      type: String,
      enum: [
        "PendingContractor", // User has requested
        "Rejected", // Contractor rejected
        "PendingPayment", // Contractor accepted, waiting for user payment
        "Confirmed", // Admin confirmed payment
        "PendingUserApproval", // Contractor uploaded work photos
        "Completed", // User clicked "Job Done" or 6hr auto-complete
        "InDispute", // User filed a dispute
        "Cancelled", // Job cancelled (e.g., user no-payment)
      ],
      default: "PendingContractor",
    },
    price: { type: Number, required: true }, // Copied from Job.adminFixedPrice

    // --- Scheduling ---
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },
    duration: { type: String }, // e.g., "1 Day", "3 Days" for multi-day jobs

    // --- Deadlines (for 6-hour limits) ---
    // We will set these when the status changes
    contractorRespondBy: { type: Date }, // 6hr limit for contractor to accept
    paymentUploadBy: { type: Date }, // 6hr limit for user to upload screenshot
    userApprovalBy: { type: Date }, // 6hr limit for user to approve work

    // --- File Uploads ---
    paymentScreenshot: { type: String }, // URL to user's payment screenshot
    workPhotos: [String], // Array of URLs to contractor's "Work Done" photos (max 6)

    // --- Dispute Details (as per your blueprint) ---
    dispute: {
      isFiled: { type: Boolean, default: false },
      details: { type: String },
      photos: [String], // Array of URLs to user's dispute photos (max 2)
      contractorResponse: { type: String }, // Contractor's counter-defense
      adminDecision: {
        type: String,
        enum: ["Pending", "UserFault", "ContractorFault"],
        default: "Pending",
      },
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
