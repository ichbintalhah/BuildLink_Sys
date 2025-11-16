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
// -------------------------

const EarningsHistory = () => {
  const { user } = useContext(AuthContext); // Get logged-in contractor
  const [allRelevantBookings, setAllRelevantBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const fetchEarnings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Fetch all relevant bookings using the smart backend function
      const response = await API.get("/bookings/contractorbookings");
      setAllRelevantBookings(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch earnings history.");
      setAllRelevantBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [user]); // Fetch when user data is available

  // Filter for completed items and calculate total earnings
  useEffect(() => {
    if (allRelevantBookings.length > 0) {
      const completed = allRelevantBookings.filter(
        (b) => b.status === "Completed"
      );
      setCompletedBookings(completed);

      // Calculate total earnings (Price * 0.95 for each completed job)
      const total = completed.reduce(
        (sum, booking) => sum + booking.price * 0.95,
        0
      );
      setTotalEarnings(total);
    } else {
      setCompletedBookings([]);
      setTotalEarnings(0);
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
      <h2 className="text-3xl font-bold mb-6">Earnings History</h2>

      {/* Summary Stat */}
      <div className="stats shadow mb-6 bg-base-200">
        <div className="stat">
          <div className="stat-title">Total Estimated Earnings</div>
          <div className="stat-value text-success">
            Rs {totalEarnings.toLocaleString()}
          </div>
          <div className="stat-desc">
            (Based on completed jobs, after 5% commission)
          </div>
        </div>
      </div>

      {completedBookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th>Completion Date</th>
                <th>Job</th>
                <th>User</th>
                <th>Your Earning</th>
              </tr>
            </thead>
            <tbody>
              {completedBookings.map((booking) => {
                const jobTitle =
                  mockJobDetails[booking.jobId]?.title || booking.jobId;
                // Need user details if required
                const userName = booking.userId?.name || "User";
                const earning = booking.price * 0.95;
                const completionDate = booking.updatedAt
                  ? new Date(booking.updatedAt).toLocaleDateString()
                  : "N/A";

                return (
                  <tr key={booking._id} className="hover">
                    <td>{completionDate}</td>
                    <td>{jobTitle}</td>
                    <td>{userName}</td>
                    <td>Rs {earning.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>You have no completed jobs yet.</p>
      )}
    </div>
  );
};

export default EarningsHistory;
