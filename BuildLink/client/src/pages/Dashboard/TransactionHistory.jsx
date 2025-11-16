import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

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

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Fetch all user bookings
        const response = await API.get("/bookings/mybookings");
        // Filter for bookings where payment was likely made (Confirmed or Completed)
        const paidBookings = response.data.filter((b) =>
          [
            "Confirmed",
            "Completed",
            "PendingUserApproval",
            "InDispute",
          ].includes(b.status)
        );
        setTransactions(paidBookings);
        setError(null);
      } catch (err) {
        setError("Failed to fetch transaction history.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); // Fetch on component load

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Transaction History</h2>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th>Date Paid (approx)</th>
                <th>Job</th>
                <th>Contractor</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((booking) => {
                const jobTitle =
                  mockJobDetails[booking.jobId]?.title || booking.jobId;
                const contractorName =
                  mockContractors[booking.contractorId]?.name ||
                  booking.contractorId;
                // Use updatedAt as an approximate payment confirmation date
                const paymentDate = booking.updatedAt
                  ? new Date(booking.updatedAt).toLocaleDateString()
                  : "N/A";

                return (
                  <tr key={booking._id} className="hover">
                    <td>{paymentDate}</td>
                    <td>{jobTitle}</td>
                    <td>{contractorName}</td>
                    <td>Rs {booking.price.toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          booking.status === "Completed"
                            ? "badge-success"
                            : "badge-ghost"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>You have no transaction history yet.</p>
      )}
    </div>
  );
};

export default TransactionHistory;
