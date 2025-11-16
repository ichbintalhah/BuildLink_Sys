import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios"; // Needed later for API calls
import LoadingSpinner from "../../components/LoadingSpinner";

const ContractorPortfolio = () => {
  const { user, setUser, loading: authLoading } = useContext(AuthContext); // Get contractor data
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Track which image is being deleted
  const [error, setError] = useState("");

  // Load initial portfolio from user context
  useEffect(() => {
    if (user && user.portfolio) {
      setPortfolioImages(user.portfolio);
    }
  }, [user]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
    } else {
      setNewImageFile(null);
    }
  };

  // --- TODO: Implement Backend Upload ---
  const handleUploadImage = async () => {
    if (!newImageFile) return;
    setUploading(true);
    setError("");
    console.log("Uploading:", newImageFile.name);

    // --- Backend Call Would Go Here ---
    // 1. Create FormData and append the file:
    //    const formData = new FormData();
    //    formData.append('portfolioImage', newImageFile);
    // 2. POST to a new backend endpoint (e.g., /api/contractors/portfolio/upload)
    //    const response = await API.post('/api/contractors/portfolio/upload', formData, { headers: {'Content-Type': 'multipart/form-data'} });
    // 3. If successful, backend returns the updated contractor data (with new portfolio array)
    // 4. Update the user context: setUser(response.data.contractor);
    // 5. Clear the file input: setNewImageFile(null); (and reset file input visually)

    // Simulate success
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Fake delay
    const newImageUrl = `https://placehold.co/600x400/cccccc/white?text=New+${Date.now()}`; // Fake URL
    setUser({ ...user, portfolio: [...portfolioImages, newImageUrl] }); // Add fake URL to context
    alert("Image uploaded successfully! (Backend integration needed)");
    setNewImageFile(null);
    // Find a way to reset the file input visually if needed
    document.getElementById("portfolio-file-input").value = null;
    // --- End TODO ---

    setUploading(false);
  };
  // ------------------------------------

  // --- TODO: Implement Backend Deletion ---
  const handleDeleteImage = async (imageUrlToDelete) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    setDeletingId(imageUrlToDelete); // Show loading state on the specific image
    setError("");
    console.log("Deleting:", imageUrlToDelete);

    // --- Backend Call Would Go Here ---
    // 1. Send DELETE request to backend (e.g., DELETE /api/contractors/portfolio/delete)
    //    Pass the image URL or a unique identifier in the request body or params.
    //    await API.delete('/api/contractors/portfolio/delete', { data: { imageUrl: imageUrlToDelete } });
    // 2. If successful, backend returns updated contractor data
    // 3. Update user context: setUser(response.data.contractor);

    // Simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake delay
    setUser({
      ...user,
      portfolio: portfolioImages.filter((url) => url !== imageUrlToDelete),
    }); // Remove from context
    alert("Image deleted successfully! (Backend integration needed)");
    // --- End TODO ---

    setDeletingId(null);
  };
  // --------------------------------------

  if (authLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Your Portfolio</h2>

      {/* Upload Section */}
      <div className="card bg-base-200 shadow-md mb-8">
        <div className="card-body">
          <h3 className="card-title">Upload New Image</h3>
          <p className="text-sm mb-4">
            Add images of your completed projects to showcase your work on your
            public profile.
          </p>
          <div className="form-control w-full max-w-md">
            <input
              id="portfolio-file-input" // Added ID for reset
              type="file"
              accept="image/*"
              className="file-input file-input-bordered file-input-primary w-full"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </div>
          {/* Image Preview (Optional) */}
          {newImageFile && (
            <img
              src={URL.createObjectURL(newImageFile)}
              alt="Preview"
              className="mt-4 max-h-40 rounded-lg shadow"
            />
          )}
          <div className="card-actions justify-end mt-4">
            <button
              className="btn btn-primary"
              onClick={handleUploadImage}
              disabled={!newImageFile || uploading}
            >
              {uploading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Upload Image"
              )}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error mb-6">{error}</div>}

      {/* Current Portfolio Grid */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Current Images</h3>
        {portfolioImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolioImages.map((imageUrl, index) => (
              <div
                key={imageUrl + index}
                className="card bg-base-100 shadow-xl relative group"
              >
                <figure>
                  <img
                    src={imageUrl}
                    alt={`Portfolio image ${index + 1}`}
                    className="h-48 w-full object-cover"
                  />
                </figure>
                {/* Delete Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex justify-center items-center transition-opacity duration-300">
                  <button
                    className="btn btn-error btn-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => handleDeleteImage(imageUrl)}
                    disabled={deletingId === imageUrl}
                  >
                    {deletingId === imageUrl ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't uploaded any portfolio images yet.</p>
        )}
      </div>
    </div>
  );
};

export default ContractorPortfolio;
