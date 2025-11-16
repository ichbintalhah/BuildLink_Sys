import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReviewModal from "../../components/ReviewModal"; // Import the new modal

// --- MOCK DATA for names ---
const mockJobDetails = {
  job1: { title: "Fix Leaky Faucet" },
  job2: { title: "Install New Toilet" },
  job3: { title: "Unclog Drain" },
  job4: { title: "Install Ceiling Fan" },
  job5: { title: "Fix Faulty Switch" },
  job6: { title: "New Wiring for a Room" },
  job7: { title: "Make Wooden Table" },
  job8: { title: "Install Wooden Door" },
  job9: { title: "Repair Wooden Bed" },
  job10: { title: "Lay Concrete Foundation" },
  job11: { title: "Excavation Services" },
  job12: { title: "Install Bathroom Tiles" },
  job13: { title: "Kitchen Floor Tiling" },
  job14: { title: "Paint Interior Room (per room)" },
  job15: { title: "Exterior Wall Painting" },
  job16: { title: "Build Brick Wall" },
  job17: { title: "Plastering Services" },
  job18: { title: "Erect Steel Frame" },
  job19: { title: "Steel Reinforcement Work" },
  job20: { title: "Build Custom Kitchen Cabinets" },
  job21: { title: "Install Wardrobe" },
  job22: { title: "Install Laminate Flooring (per sq ft)" },
  job23: { title: "Wooden Floor Polishing" },
};
const mockContractors = {
  c1: { name: "Ali Khan Plumbing" },
  c2: { name: "Saqib Maintenance" },
  c3: { name: "Javaid Carpentry Works" },
  c4: { name: "Lahore Wood Crafts" },
  c5: { name: "Rana Builders" },
  c6: { name: "Punjab Tiling & Flooring" },
  c7: { name: "City Painters" },
  c8: { name: "Faisal Steel Fabricators" },
};
// -------------------------

const BookingHistory = () => {
  const [historyBookings, setHistoryBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State for Review Modal ---
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewBookingDetails, setReviewBookingDetails] = useState(null); // { bookingId, contractorId, contractorName }
  // -----------------------------

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await API.get("/bookings/mybookings");
      setHistoryBookings(
        response.data.filter((b) =>
          ["Completed", "Rejected", "Cancelled"].includes(b.status)
        )
      );
      setError(null);
    } catch (err) {
      setError("Failed to fetch booking history.");
      setHistoryBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // --- Function to open the review modal ---
  const handleOpenReviewModal = (bookingId, contractorId, contractorName) => {
    setReviewBookingDetails({ bookingId, contractorId, contractorName });
    setIsReviewModalOpen(true);
  };
  // ------------------------------------------

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Booking History</h2>
      <div className="space-y-4">
        {historyBookings.length > 0 ? (
          historyBookings.map((booking) => {
            const jobTitle =
              mockJobDetails[booking.jobId]?.title || "Job Title Not Found";
            const contractorName =
              mockContractors[booking.contractorId]?.name ||
              "Contractor Not Found";

            let statusColor = "badge-ghost";
            if (booking.status === "Completed") statusColor = "badge-success";
            else if (booking.status === "Rejected") statusColor = "badge-error";
            else if (booking.status === "Cancelled")
              statusColor = "badge-warning";

            return (
              <div
                key={booking._id}
                className="collapse collapse-plus bg-base-200"
              >
                <input type="radio" name="history-accordion" />
                <div className="collapse-title text-xl font-medium">
                  {jobTitle}
                  <span className={`badge ml-4 ${statusColor}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="collapse-content">
                  <p>
                    <strong>Contractor:</strong> {contractorName}
                  </p>
                  <p>
                    <strong>Price:</strong> Rs {booking.price.toLocaleString()}
                  </p>
                  <p>
                    <strong>Scheduled for:</strong>{" "}
                    {new Date(booking.scheduledDate).toLocaleDateString()} at{" "}
                    {booking.scheduledTime}
                  </p>
                  <p>
                    <strong>Completed On:</strong>{" "}
                    {booking.updatedAt
                      ? new Date(booking.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </p>

                  {/* --- UPDATED: Leave Review Button --- */}
                  {booking.status === "Completed" && (
                    <div className="mt-4">
                      <button
                        className="btn btn-sm btn-outline btn-info"
                        // Pass necessary details to the open function
                        onClick={() =>
                          handleOpenReviewModal(
                            booking._id,
                            booking.contractorId,
                            contractorName
                          )
                        }
                      >
                        Leave a Review
                      </button>
                    </div>
                  )}
                  {/* ---------------------------------- */}
                </div>
              </div>
            );
          })
        ) : (
          <p>You have no past bookings.</p>
        )}
      </div>

      {/* Render the Review Modal (it's hidden by default) */}
      {reviewBookingDetails && (
        <ReviewModal
          open={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          bookingId={reviewBookingDetails.bookingId}
          contractorId={reviewBookingDetails.contractorId}
          contractorName={reviewBookingDetails.contractorName}
        />
      )}
    </div>
  );
};

export default BookingHistory;
