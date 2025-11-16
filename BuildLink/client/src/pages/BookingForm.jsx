import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";

// --- MOCK DATA (FULLY COMPLETED) ---
const mockJobsForContractor = {
  c1: [
    // Ali Khan Plumbing
    { _id: "job1", title: "Fix Leaky Faucet", adminFixedPrice: 1500 },
    { _id: "job2", title: "Install New Toilet", adminFixedPrice: 5000 },
  ],
  c2: [
    // Saqib Maintenance
    { _id: "job1", title: "Fix Leaky Faucet", adminFixedPrice: 1500 },
    { _id: "job4", title: "Install Ceiling Fan", adminFixedPrice: 3000 },
    { _id: "job12", title: "Install Bathroom Tiles", adminFixedPrice: 9000 },
  ],
  c3: [
    // Javaid Carpentry
    { _id: "job7", title: "Make Wooden Table", adminFixedPrice: 8000 },
    { _id: "job8", title: "Install Wooden Door", adminFixedPrice: 6000 },
  ],
  c4: [
    // Lahore Wood Crafts
    { _id: "job9", title: "Repair Wooden Bed", adminFixedPrice: 4000 },
  ],
  c5: [
    // Rana Builders
    { _id: "job10", title: "Lay Concrete Foundation", adminFixedPrice: 50000 },
    { _id: "job16", title: "Build Brick Wall", adminFixedPrice: 15000 },
  ],
  c6: [
    // Punjab Tiling
    { _id: "job12", title: "Install Bathroom Tiles", adminFixedPrice: 9000 },
    { _id: "job13", title: "Kitchen Floor Tiling", adminFixedPrice: 12000 },
  ],
  c7: [
    // City Painters
    {
      _id: "job14",
      title: "Paint Interior Room (per room)",
      adminFixedPrice: 7000,
    },
    { _id: "job15", title: "Exterior Wall Painting", adminFixedPrice: 20000 },
  ],
  c8: [
    // Faisal Steel
    { _id: "job18", title: "Erect Steel Frame", adminFixedPrice: 75000 },
    { _id: "job19", title: "Steel Reinforcement Work", adminFixedPrice: 40000 },
  ],
};

const mockContractorDetails = {
  c1: { name: "Ali Khan Plumbing" },
  c2: { name: "Saqib Maintenance" },
  c3: { name: "Javaid Carpentry Works" },
  c4: { name: "Lahore Wood Crafts" },
  c5: { name: "Rana Builders" },
  c6: { name: "Punjab Tiling Co." },
  c7: { name: "City Painters" },
  c8: { name: "Faisal Steel Fabricators" },
};
// -----------------------------------------------------------------

const BookingForm = () => {
  const { contractorId } = useParams();
  const navigate = useNavigate();

  const [contractor, setContractor] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedJobPrice, setSelectedJobPrice] = useState(0);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState("1 Day");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setContractor(mockContractorDetails[contractorId]);
      setJobs(mockJobsForContractor[contractorId] || []);
      setLoading(false);
    }, 500);
  }, [contractorId]);

  useEffect(() => {
    const selectedJob = jobs.find((j) => j._id === selectedJobId);
    if (selectedJob) {
      setSelectedJobPrice(selectedJob.adminFixedPrice);
    } else {
      setSelectedJobPrice(0);
    }
  }, [selectedJobId, jobs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJobId || !scheduledDate || !scheduledTime) {
      setError("Please fill out all fields.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      await API.post("/bookings/request", {
        contractorId,
        jobId: selectedJobId,
        scheduledDate,
        scheduledTime,
        duration,
        price: selectedJobPrice,
      });
      alert(
        "Booking request sent successfully! You will be notified when the contractor responds."
      );
      navigate("/dashboard/user");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send booking request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!contractor) {
    return (
      <div className="text-center p-10">
        <h2>Contractor not found.</h2> <p>Unable to create a booking.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-base-200 rounded-box">
      <h1 className="text-3xl font-bold mb-2">Book a Service</h1>
      <p className="mb-6">
        You are booking a service with{" "}
        <span className="font-bold text-primary">{contractor.name}</span>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Select a Job</span>
          </label>
          <select
            className="select select-bordered"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            required
          >
            <option disabled value="">
              Pick one
            </option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        {selectedJobPrice > 0 && (
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              Fixed Price for this job:{" "}
              <span className="font-bold">
                Rs {selectedJobPrice.toLocaleString()}
              </span>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Time</span>
            </label>
            <input
              type="time"
              className="input input-bordered"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Estimated Duration</span>
            </label>
            <select
              className="select select-bordered"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option>1 Day</option>
              <option>2-3 Days</option>
              <option>About 1 Week</option>
              <option>More than 1 Week</option>
            </select>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Send Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
