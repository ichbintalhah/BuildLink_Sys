import React, { useState, useEffect, useRef } from "react";
import API from "../api/axios"; // Needed later for submitting dispute

const DisputeModal = ({ open, onClose, bookingId, contractorName }) => {
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState([]); // Array to hold up to 2 files
  const [photoPreviews, setPhotoPreviews] = useState([]); // For image previews
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setDetails("");
      setPhotos([]);
      setPhotoPreviews([]);
      setError("");
    }
  }, [open]);

  // Control the DaisyUI dialog modal
  useEffect(() => {
    const modal = dialogRef.current;
    if (open) {
      modal?.showModal();
    } else {
      modal?.close();
    }
  }, [open]);

  // Handle photo selection and preview
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 2) {
      setError("You can upload a maximum of 2 photos.");
      setPhotos([]);
      setPhotoPreviews([]);
      e.target.value = null; // Clear file input
      return;
    }
    setError("");
    setPhotos(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  // --- TODO: Implement Backend Submission ---
  const handleSubmitDispute = async (e) => {
    e.preventDefault();
    if (!details.trim()) {
      setError("Please provide details about the issue.");
      return;
    }
    if (photos.length === 0) {
      setError("Please upload at least one photo of the issue.");
      return;
    }
    setSubmitting(true);
    setError("");

    console.log("Submitting dispute:", { bookingId, details });
    console.log("Photos:", photos);

    // --- Backend Call Would Go Here ---
    // 1. Create FormData
    //    const formData = new FormData();
    //    formData.append('details', details);
    //    formData.append('bookingId', bookingId); // Optional, if not in URL
    //    photos.forEach(photo => formData.append('disputePhotos', photo)); // 'disputePhotos' must match backend
    // 2. POST to backend (e.g., /api/bookings/:id/file-dispute using formData)
    //    await API.post(`/api/bookings/${bookingId}/file-dispute`, formData, { headers: {'Content-Type': 'multipart/form-data'} });
    // 3. If successful, backend updates booking status to 'InDispute'
    // 4. Show success message, close modal, refresh bookings list

    // Simulate success
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert(
      `Dispute filed for booking with ${contractorName}. Admin will review within 24 hours. (Backend needed)`
    );
    // --- End TODO ---

    setSubmitting(false);
    onClose(); // Close modal
  };
  // ------------------------------------

  // Clean up preview URLs when component unmounts or previews change
  useEffect(() => {
    return () => photoPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [photoPreviews]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box w-11/12 max-w-lg relative">
        <h3 className="font-bold text-lg mb-4">
          File a Dispute for Job with {contractorName}
        </h3>

        <form onSubmit={handleSubmitDispute} className="space-y-4">
          {/* Issue Details Textarea */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Describe the Issue <span className="text-error">*</span>
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Please explain the problem clearly..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Photo Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Upload Photos (1-2 required){" "}
                <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="file-input file-input-bordered file-input-error file-input-sm w-full" // Added error color for emphasis
              onChange={handlePhotoSelect}
              required={photos.length === 0} // Make required if no photos selected
            />
            {/* Photo Previews */}
            {photoPreviews.length > 0 && (
              <div className="flex gap-2 mt-2">
                {photoPreviews.map((previewUrl, index) => (
                  <img
                    key={index}
                    src={previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded shadow"
                  />
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-error text-sm p-3">{error}</div>
          )}

          {/* Submit Button */}
          <div className="modal-action mt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-error"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Submit Dispute"
              )}
            </button>
          </div>
        </form>

        {/* Close button (top right) */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
          disabled={submitting}
        >
          ✕
        </button>
      </div>
      {/* Background closes on click */}
      <form method="dialog" className="modal-backdrop">
        <button disabled={submitting}>close</button>
      </form>
    </dialog>
  );
};

export default DisputeModal;
