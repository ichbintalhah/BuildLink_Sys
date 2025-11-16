import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import DisputeModal from "../../components/DisputeModal";

// --- MOCK DATA ---
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
// -----------------

const CurrentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeBookingDetails, setDisputeBookingDetails] = useState(null);

  // --- Helper Functions ---
  const fetchBookings = async () => {
    try {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors
      const response = await API.get("/bookings/mybookings");
      console.log("Fetched bookings:", response.data); // Log fetched data
      setBookings(response.data);
    } catch (err) {
      console.error("Fetch bookings error:", err); // Log error
      setError("Failed to fetch bookings.");
      setBookings([]);
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  const handleFileUpload = async (bookingId, file) => {
    if (!file) return;
    setUploading(bookingId);
    const formData = new FormData();
    formData.append("paymentScreenshot", file);

    try {
      await API.post(`/bookings/${bookingId}/upload-payment`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Screenshot uploaded! Admin will verify it soon.");
      fetchBookings();
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const handleMarkComplete = async (bookingId) => {
    setUpdatingId(bookingId);
    try {
      await API.post(`/bookings/${bookingId}/complete`);
      alert("Job marked as complete! Thank you.");
      fetchBookings();
    } catch (err) {
      alert("Failed to mark job as complete.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenFileDisputeModal = (
    bookingId,
    contractorId,
    contractorName
  ) => {
    setDisputeBookingDetails({ bookingId, contractorId, contractorName });
    setIsDisputeModalOpen(true);
  };
  // --- End Helper Functions ---

  useEffect(() => {
    fetchBookings();
  }, []);

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render error state
  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  // Filter bookings after loading is complete and no error
  const currentBookings = bookings.filter(
    (b) => !["Completed", "Rejected", "Cancelled"].includes(b.status)
  );

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Current Bookings</h2>
      <div className="space-y-4">
        {currentBookings.length > 0 ? (
          currentBookings.map((booking) => {
            // Look up names (make sure mock data is defined outside component)
            const jobTitle =
              mockJobDetails[booking.jobId]?.title || "Job Title Not Found";
            const contractorName =
              mockContractors[booking.contractorId]?.name ||
              "Contractor Not Found";

            // Determine badge color based on status
            let statusColor = "badge-ghost";
            if (booking.status === "PendingPayment")
              statusColor = "badge-warning";
            else if (booking.status === "PendingContractor")
              statusColor = "badge-info";
            else if (booking.status === "Confirmed")
              statusColor = "badge-success";
            else if (booking.status === "PendingUserApproval")
              statusColor = "badge-accent";
            else if (booking.status === "InDispute")
              statusColor = "badge-error";

            return (
              // Collapse item for each booking
              <div
                key={booking._id}
                className="collapse collapse-plus bg-base-200"
              >
                <input
                  type="radio"
                  name="my-accordion-3"
                  defaultChecked={currentBookings.length === 1}
                />
                {/* Title section */}
                <div className="collapse-title text-xl font-medium">
                  {jobTitle}
                  <span className={`badge ml-4 ${statusColor}`}>
                    {booking.status}
                  </span>
                </div>
                {/* Content section */}
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
                    <strong>Estimated Duration:</strong> {booking.duration}
                  </p>
                  {/* Action blocks based on status */}
                  <div className="mt-4">
                    {/* Pending Payment block */}
                    {booking.status === "PendingPayment" && (
                      <div className="p-4 bg-warning/20 rounded-lg">
                        <h4 className="font-bold">
                          Action Required: Upload Payment
                        </h4>
                        <p className="text-sm mb-2">
                          Your request was accepted! Please pay Rs{" "}
                          {booking.price.toLocaleString()} to the admin and
                          upload a screenshot within 6 hours.
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                          onChange={(e) =>
                            handleFileUpload(booking._id, e.target.files[0])
                          }
                          disabled={uploading === booking._id}
                        />
                        {uploading === booking._id && (
                          <span className="loading loading-spinner loading-sm ml-2"></span>
                        )}
                      </div>
                    )}
                    {/* Pending User Approval block */}
                    {booking.status === "PendingUserApproval" && (
                      <div className="p-4 bg-accent/20 rounded-lg">
                        <h4 className="font-bold">
                          Action Required: Approve Completion
                        </h4>
                        <p className="text-sm mb-2">
                          The contractor has marked the job as done. Please
                          review their work and approve or file a dispute within
                          6 hours.
                        </p>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-success"
                            onClick={() => handleMarkComplete(booking._id)}
                            disabled={updatingId === booking._id}
                          >
                            {updatingId === booking._id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Job Done (Approve)"
                            )}
                          </button>
                          <button
                            className="btn btn-error"
                            onClick={() =>
                              handleOpenFileDisputeModal(
                                booking._id,
                                booking.contractorId,
                                contractorName
                              )
                            }
                            disabled={updatingId === booking._id}
                          >
                            File Dispute
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Confirmed block */}
                    {booking.status === "Confirmed" && (
                      <div className="p-4 bg-info/20 rounded-lg">
                        <h4 className="font-bold">Job Confirmed</h4>
                        <p className="text-sm mb-2">
                          Your payment has been confirmed by the admin. The
                          contractor will proceed with the job as scheduled.
                        </p>
                      </div>
                    )}
                    {/* Pending Contractor block */}
                    {booking.status === "PendingContractor" && (
                      <div className="p-4 bg-info/20 rounded-lg">
                        <h4 className="font-bold">Request Sent</h4>
                        <p className="text-sm mb-2">
                          Your booking request has been sent to the contractor.
                          Please wait up to 6 hours for their response.
                        </p>
                      </div>
                    )}
                  </div>{" "}
                  {/* End of Action blocks container */}
                </div>{" "}
                {/* End of Collapse Content */}
              </div> // End of Collapse Item
            ); // End of map return
          }) // End of map function
        ) : (
          // Else (no current bookings)
          <p>You have no active bookings.</p>
        )}{" "}
        {/* End of conditional rendering */}
      </div>{" "}
      {/* End of space-y-4 container */}
      {/* Render the Dispute Modal */}
      {disputeBookingDetails && (
        <DisputeModal
          open={isDisputeModalOpen}
          onClose={() => setIsDisputeModalOpen(false)}
          bookingId={disputeBookingDetails.bookingId}
          contractorName={disputeBookingDetails.contractorName}
        />
      )}
    </div> // End of main component div
  ); // End of component return
}; // End of component function

export default CurrentBookings;
