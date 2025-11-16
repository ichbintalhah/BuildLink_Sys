import React, { useState, useEffect, useContext } from "react";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/AuthContext";

// --- MOCK DATA ---
const mockContractors = {
  c1: { name: "Ali Khan Plumbing", skills: ["Plumber"] },
  c2: {
    name: "Saqib Maintenance",
    skills: ["Plumber", "Electrician", "Tiling"],
  },
  c3: {
    name: "Javaid Carpentry Works",
    skills: ["Carpenter", "Cabinet Making"],
  },
  c4: { name: "Lahore Wood Crafts", skills: ["Carpenter"] },
  c5: { name: "Rana Builders", skills: ["Foundation Work", "Masonry"] },
  c6: { name: "Punjab Tiling & Flooring", skills: ["Tiling", "Flooring"] },
  c7: { name: "City Painters", skills: ["Painter"] },
  c8: { name: "Faisal Steel Fabricators", skills: ["Structural Steel"] },
};
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
// -------------------------

const JobRequests = () => {
  const { user } = useContext(AuthContext);
  const [allRelevantBookings, setAllRelevantBookings] = useState([]); // Bookings matching skills
  const [pendingRequests, setPendingRequests] = useState([]); // Filtered for PendingContractor status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Fetch ALL relevant bookings (backend change from previous step)
      const response = await API.get("/bookings/contractorbookings");
      setAllRelevantBookings(response.data); // Store the full relevant list
      setError(null);
    } catch (err) {
      setError("Failed to fetch job requests.");
      setAllRelevantBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // --- UPDATED: Filter bookings based on skill AND status ---
  useEffect(() => {
    if (allRelevantBookings.length > 0) {
      // Now, filter the relevant list to only show pending requests
      const pending = allRelevantBookings.filter(
        (booking) => booking.status === "PendingContractor"
      );
      setPendingRequests(pending);
    } else {
      setPendingRequests([]); // Clear if no relevant bookings
    }
  }, [allRelevantBookings]); // Re-filter when the full list changes
  // --- End Filtering Logic ---

  const handleAccept = async (bookingId) => {
    setUpdatingId(bookingId);
    try {
      await API.post(`/bookings/${bookingId}/accept`);
      fetchRequests(); // Refresh the list
    } catch (err) {
      alert("Failed to accept the booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    setUpdatingId(bookingId);
    try {
      await API.post(`/bookings/${bookingId}/reject`);
      fetchRequests(); // Refresh the list
    } catch (err) {
      alert("Failed to reject the booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Display loading spinner while fetching or if user data isn't ready
  if (loading || !user) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">New Job Requests</h2>
      <p className="text-sm mb-4">
        Showing requests relevant to your skills:{" "}
        {user.skills?.join(", ") || "None"}
      </p>
      <div className="space-y-4">
        {/* --- Use the filtered pendingRequests list --- */}
        {pendingRequests.length > 0 ? (
          pendingRequests.map((req) => {
            const jobTitle =
              mockJobDetails[req.jobId]?.title || "Job Title Not Found";
            // User name lookup would require backend populate or separate fetch
            const userName = req.userId?.name || "User";

            return (
              <div key={req._id} className="collapse collapse-plus bg-base-200">
                <input
                  type="radio"
                  name="request-accordion"
                  defaultChecked={pendingRequests.length === 1}
                />
                <div className="collapse-title text-xl font-medium">
                  {jobTitle} - Requested by {userName}
                </div>
                <div className="collapse-content">
                  <p>
                    <strong>Scheduled for:</strong>{" "}
                    {new Date(req.scheduledDate).toLocaleDateString()} at{" "}
                    {req.scheduledTime}
                  </p>
                  <p>
                    <strong>Estimated Duration:</strong> {req.duration}
                  </p>
                  <p>
                    <strong>Your Earning (after 5% commission):</strong> Rs{" "}
                    {(req.price * 0.95).toLocaleString()}
                  </p>
                  {req.contractorRespondBy && (
                    <p className="text-sm text-warning mt-2">
                      Please respond by{" "}
                      {new Date(req.contractorRespondBy).toLocaleTimeString(
                        [],
                        { hour: "numeric", minute: "2-digit" }
                      )}
                    </p>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button
                      className="btn btn-success"
                      onClick={() => handleAccept(req._id)}
                      disabled={updatingId === req._id}
                    >
                      {updatingId === req._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Accept"
                      )}
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleReject(req._id)}
                      disabled={updatingId === req._id}
                    >
                      {updatingId === req._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>You have no pending job requests matching your skills.</p>
        )}
      </div>
    </div>
  );
};

export default JobRequests;
