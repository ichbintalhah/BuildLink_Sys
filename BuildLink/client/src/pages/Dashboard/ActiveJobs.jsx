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
// We might need user names later if we fetch them properly
// -------------------------

const ActiveJobs = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingId, setUploadingId] = useState(null); // Tracks which job is uploading photos
  const [selectedFiles, setSelectedFiles] = useState({}); // Stores files for each booking { bookingId: [file1, file2...] }

  const fetchActiveJobs = async () => {
    try {
      setLoading(true);
      // Fetch all bookings for this contractor
      const response = await API.get("/bookings/contractorbookings");
      // Filter to show only the 'Confirmed' jobs
      setActiveJobs(response.data.filter((b) => b.status === "Confirmed"));
      setError(null);
    } catch (err) {
      setError("Failed to fetch active jobs.");
      setActiveJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveJobs();
  }, []); // Fetch on component load

  // --- Work Photo Upload Logic ---
  const handleFileSelect = (bookingId, files) => {
    if (files.length > 6) {
      alert("You can upload a maximum of 6 photos.");
      // Clear the selection if too many files
      setSelectedFiles((prev) => ({ ...prev, [bookingId]: [] }));
      // Optional: Clear the file input visually (requires useRef)
      return;
    }
    setSelectedFiles((prev) => ({ ...prev, [bookingId]: Array.from(files) }));
  };

  const handleUploadWorkPhotos = async (bookingId) => {
    const filesToUpload = selectedFiles[bookingId];
    if (!filesToUpload || filesToUpload.length === 0) {
      alert("Please select photos to upload.");
      return;
    }
    if (filesToUpload.length > 6) {
      alert("You can upload a maximum of 6 photos.");
      return;
    }

    setUploadingId(bookingId);
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("workPhotos", file); // 'workPhotos' must match backend
    });

    try {
      // Call the backend endpoint to upload work photos
      await API.post(`/bookings/${bookingId}/upload-work`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Work photos uploaded successfully! Waiting for user approval.");
      setSelectedFiles((prev) => ({ ...prev, [bookingId]: [] })); // Clear selected files
      fetchActiveJobs(); // Refresh the list (job will disappear)
    } catch (err) {
      alert("Photo upload failed. Please try again.");
    } finally {
      setUploadingId(null);
    }
  };
  // --- End Upload Logic ---

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Active Jobs</h2>
      <div className="space-y-4">
        {activeJobs.length > 0 ? (
          activeJobs.map((job) => {
            const jobTitle = mockJobDetails[job.jobId]?.title || job.jobId;
            // Need user details if required - could fetch separately or adjust backend
            const userName = job.userId?.name || "User";

            return (
              <div key={job._id} className="collapse collapse-plus bg-base-200">
                <input
                  type="radio"
                  name="active-job-accordion"
                  defaultChecked={activeJobs.length === 1}
                />
                <div className="collapse-title text-xl font-medium">
                  {jobTitle} - For {userName}
                  <span className="badge badge-success ml-4">{job.status}</span>
                </div>
                <div className="collapse-content">
                  <p>
                    <strong>User:</strong> {userName}
                  </p>
                  <p>
                    <strong>Scheduled for:</strong>{" "}
                    {new Date(job.scheduledDate).toLocaleDateString()} at{" "}
                    {job.scheduledTime}
                  </p>
                  <p>
                    <strong>Price:</strong> Rs {job.price.toLocaleString()}
                  </p>
                  <p>
                    <strong>Your Earning:</strong> Rs{" "}
                    {(job.price * 0.95).toLocaleString()}
                  </p>

                  {/* --- Work Photo Upload Section --- */}
                  <div className="mt-4 p-4 border border-dashed border-primary rounded-lg">
                    <h4 className="font-bold mb-2">
                      Upload Work Done Photos (Max 6)
                    </h4>
                    <input
                      type="file"
                      multiple // Allow multiple files
                      accept="image/*"
                      className="file-input file-input-bordered file-input-primary file-input-sm w-full max-w-md"
                      // Reset file input visually if needed by controlling its value or using a key prop
                      onChange={(e) =>
                        handleFileSelect(job._id, e.target.files)
                      }
                    />
                    {/* Display names of selected files */}
                    {selectedFiles[job._id]?.length > 0 && (
                      <div className="text-xs mt-2 text-gray-500">
                        Selected:{" "}
                        {selectedFiles[job._id].map((f) => f.name).join(", ")}
                      </div>
                    )}
                    <button
                      className="btn btn-primary btn-sm mt-3"
                      onClick={() => handleUploadWorkPhotos(job._id)}
                      disabled={
                        uploadingId === job._id ||
                        !selectedFiles[job._id] ||
                        selectedFiles[job._id].length === 0
                      }
                    >
                      {uploadingId === job._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Upload Photos"
                      )}
                    </button>
                  </div>
                  {/* --- End Upload Section --- */}
                </div>
              </div>
            );
          })
        ) : (
          <p>You have no active jobs right now.</p>
        )}
      </div>
    </div>
  );
};

export default ActiveJobs;
