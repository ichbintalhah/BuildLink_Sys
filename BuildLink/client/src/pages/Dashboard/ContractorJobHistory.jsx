import React, { useState, useEffect, useContext } from "react";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/AuthContext"; // Needed for skill matching

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
// -------------------------

const ContractorJobHistory = () => {
  const { user } = useContext(AuthContext); // Get logged-in contractor
  const [allRelevantBookings, setAllRelevantBookings] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    if (!user) return; // Don't fetch if user isn't loaded yet

    try {
      setLoading(true);
      // Fetch all relevant bookings using the smart backend function
      const response = await API.get("/bookings/contractorbookings");
      setAllRelevantBookings(response.data); // Store all relevant bookings
      setError(null);
    } catch (err) {
      setError("Failed to fetch booking history.");
      setAllRelevantBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]); // Fetch when user data is available

  // Filter for history items when all relevant bookings are loaded
  useEffect(() => {
    if (allRelevantBookings.length > 0) {
      const history = allRelevantBookings.filter((b) =>
        ["Completed", "Rejected", "Cancelled"].includes(b.status)
      );
      setHistoryBookings(history);
    } else {
      setHistoryBookings([]);
    }
  }, [allRelevantBookings]);

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Job History</h2>
      <div className="space-y-4">
        {historyBookings.length > 0 ? (
          historyBookings.map((booking) => {
            const jobTitle =
              mockJobDetails[booking.jobId]?.title || "Job Title Not Found";
            // Need user details if required - could fetch separately or adjust backend
            const userName = booking.userId?.name || "User";

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
                <input type="radio" name="contractor-history-accordion" />
                <div className="collapse-title text-xl font-medium">
                  {jobTitle} - For {userName}
                  <span className={`badge ml-4 ${statusColor}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="collapse-content">
                  <p>
                    <strong>User:</strong> {userName}
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
                    <strong>Final Status Date:</strong>{" "}
                    {booking.updatedAt
                      ? new Date(booking.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {/* You could add details about earnings/payout here later */}
                </div>
              </div>
            );
          })
        ) : (
          <p>You have no past job history.</p>
        )}
      </div>
    </div>
  );
};

export default ContractorJobHistory;
