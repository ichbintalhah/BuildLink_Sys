import React, { useState, useEffect, useRef } from "react";
import API from "../api/axios"; // We'll need this to submit the review

const ReviewModal = ({
  open,
  onClose,
  bookingId,
  contractorId,
  contractorName,
}) => {
  const [rating, setRating] = useState(0); // 0 = no rating selected
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);

  // Reset form when modal opens/closes or booking changes
  useEffect(() => {
    if (open) {
      setRating(0);
      setComment("");
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      // --- TODO: Backend Call ---
      // We need a backend endpoint to save this review.
      // Example: await API.post('/api/reviews', { bookingId, contractorId, rating, comment });
      console.log("Submitting review:", {
        bookingId,
        contractorId,
        rating,
        comment,
      });
      alert(
        `Review submitted for ${contractorName}! (Backend endpoint needed)`
      );
      // --- End TODO ---

      setSubmitting(false);
      onClose(); // Close the modal on success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
      setSubmitting(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box w-11/12 max-w-lg relative">
        <h3 className="font-bold text-lg mb-4">
          Leave a Review for {contractorName}
        </h3>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          {/* Star Rating */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Rating</span>
            </label>
            <div className="rating rating-lg">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <input
                    key={ratingValue}
                    type="radio"
                    name="rating-star"
                    className="mask mask-star-2 bg-orange-400"
                    checked={rating === ratingValue}
                    onChange={() => setRating(ratingValue)}
                  />
                );
              })}
            </div>
          </div>

          {/* Comment Textarea */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Comments (Optional)</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
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
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Submit Review"
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

export default ReviewModal;
