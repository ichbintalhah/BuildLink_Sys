const Booking = require("../models/Booking");
const Contractor = require("../models/Contractor");

// --- STEP 6: Admin confirms payment ---
exports.confirmPayment = async (req, res) => {
  try {
    const { id } = req.params; // Booking ID
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update status from 'PendingPayment' to 'Confirmed'
    booking.status = "Confirmed";

    // (Your blueprint logic: User's address/phone are now shared)
    // We don't need to do anything here; the frontend will
    // now show the user's info to the contractor.

    await booking.save();
    res
      .status(200)
      .json({ message: "Payment confirmed! Job is now active.", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- DISPUTE: Admin resolves a dispute ---
exports.resolveDispute = async (req, res) => {
  try {
    const { id } = req.params; // Booking ID
    const { decision } = req.body; // Admin sends 'UserFault' or 'ContractorFault'

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (decision === "UserFault") {
      // Case A: User is at fault
      booking.status = "Completed"; // Mark as complete
      booking.dispute.adminDecision = "UserFault";
      // (Admin will now manually release payment to contractor)
    } else if (decision === "ContractorFault") {
      // Case B: Contractor is at fault
      booking.status = "Cancelled"; // Or 'Completed' if you prefer
      booking.dispute.adminDecision = "ContractorFault";
      // (Admin will now manually refund the user)

      // --- Apply Penalty (as per your blueprint) ---
      // Add "Less Trusted" tag to the contractor
      const contractor = await Contractor.findById(booking.contractorId);
      if (contractor) {
        if (!contractor.tags.includes("Less Trusted")) {
          contractor.tags.push("Less Trusted");
          await contractor.save();
        }
      }
    } else {
      return res.status(400).json({
        message: "Invalid decision. Must be 'UserFault' or 'ContractorFault'.",
      });
    }

    await booking.save();
    res
      .status(200)
      .json({ message: `Dispute resolved. Decision: ${decision}`, booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- DASHBOARD: Get all bookings needing payment confirmation ---
exports.getPendingPayments = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "PendingPayment" });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- DASHBOARD: Get all bookings currently in dispute ---
exports.getDisputedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "InDispute" });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
