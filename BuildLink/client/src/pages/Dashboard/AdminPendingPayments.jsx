import React, { useState, useEffect, useContext } from "react";
import API from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/AuthContext"; // To check if user is admin

// --- We need mock data again for names ---
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
// ------------------------------------

const AdminPendingPayments = () => {
  const { user } = useContext(AuthContext);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/pending-payments");
      setPendingBookings(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch pending payments.");
      setPendingBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch only if logged in as admin
    if (user?.role === "admin") {
      fetchPendingPayments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleConfirmPayment = async (bookingId) => {
    setConfirmingId(bookingId);
    try {
      await API.post(`/admin/confirm-payment/${bookingId}`);
      alert("Payment confirmed successfully!");
      fetchPendingPayments(); // Refresh the list
    } catch (err) {
      alert("Failed to confirm payment.");
    } finally {
      setConfirmingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pending Payment Confirmations</h1>
      <div className="space-y-4">
        {pendingBookings.length > 0 ? (
          pendingBookings.map((booking) => {
            const jobTitle =
              mockJobDetails[booking.jobId]?.title || booking.jobId;
            const contractorName =
              mockContractors[booking.contractorId]?.name ||
              booking.contractorId;
            // Ideally, fetch user details properly in the backend if needed
            const userName = booking.userId?.name || "Unknown User";

            return (
              <div key={booking._id} className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h2 className="card-title">{jobTitle}</h2>
                  <p>
                    <strong>User:</strong> {userName}
                  </p>
                  <p>
                    <strong>Contractor:</strong> {contractorName}
                  </p>
                  <p>
                    <strong>Price:</strong> Rs {booking.price.toLocaleString()}
                  </p>
                  <p>
                    <strong>Screenshot:</strong>
                    {booking.paymentScreenshot ? (
                      <a
                        href={`http://localhost:5000/${booking.paymentScreenshot.replace(
                          /\\/g,
                          "/"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary ml-2"
                      >
                        (View Screenshot)
                      </a>
                    ) : (
                      " (Not Uploaded)"
                    )}
                  </p>
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-success"
                      onClick={() => handleConfirmPayment(booking._id)}
                      disabled={confirmingId === booking._id}
                    >
                      {confirmingId === booking._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Confirm Payment"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No bookings are currently awaiting payment confirmation.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPendingPayments;
