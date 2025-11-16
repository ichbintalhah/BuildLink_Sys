import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios"; // We'll need this later for saving changes
import LoadingSpinner from "../../components/LoadingSpinner";

const UserProfile = () => {
  const { user, setUser, loading: authLoading } = useContext(AuthContext); // Get user data and setter
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    profileImage: "", // Store the image URL
    // We generally don't allow changing email or payment info easily for security
  });
  const [editing, setEditing] = useState(false); // To toggle edit mode
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null); // For new image upload

  // Pre-fill form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]); // Re-run if user object changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // Optional: Show a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, profileImage: event.target.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // --- TODO: Implement Backend Saving ---
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    console.log("Saving data:", formData);
    console.log("Image file:", imageFile);
    // --- Backend Call Would Go Here ---
    // 1. If imageFile exists, upload it first to get a URL
    //    (e.g., POST /api/upload/profile-image) -> returns imageUrl
    // 2. Update formData with the new imageUrl if applicable
    // 3. Send updated formData (name, phone, address, imageUrl) to backend
    //    (e.g., PUT /api/users/profile)
    // 4. If successful, update the user in AuthContext: setUser(updatedUserData)
    // 5. Turn off editing mode: setEditing(false)

    // Simulate success for now
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake delay
    alert("Profile updated successfully! (Backend integration needed)");
    // In a real app, update context: setUser({...user, ...formData, profileImage: newImageUrl });
    setSaving(false);
    setEditing(false);
    setImageFile(null); // Clear selected file
    // --- End TODO ---
  };
  // ------------------------------------

  if (authLoading || !user) {
    return <LoadingSpinner />; // Wait for user data to load
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <form onSubmit={handleSaveChanges}>
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="avatar mb-4">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {/* Show uploaded preview or existing image */}
                  <img
                    src={
                      formData.profileImage ||
                      `https://ui-avatars.com/api/?name=${formData.name}&background=random&size=128`
                    }
                    alt="Profile"
                  />
                </div>
              </div>
              {editing && (
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered file-input-primary file-input-sm w-full max-w-xs"
                  onChange={handleImageChange}
                />
              )}
            </div>

            {/* Info Fields */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`input input-bordered ${
                    !editing ? "input-disabled" : ""
                  }`}
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!editing}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                {/* Email usually not editable */}
                <input
                  type="email"
                  name="email"
                  className="input input-bordered input-disabled"
                  value={user.email}
                  readOnly
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`input input-bordered ${
                    !editing ? "input-disabled" : ""
                  }`}
                  value={formData.phone}
                  onChange={handleChange}
                  readOnly={!editing}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <textarea
                  name="address"
                  className={`textarea textarea-bordered h-24 ${
                    !editing ? "textarea-disabled" : ""
                  }`}
                  value={formData.address}
                  onChange={handleChange}
                  readOnly={!editing}
                ></textarea>
              </div>
            </div>

            {error && <div className="alert alert-error mt-4">{error}</div>}

            {/* Action Buttons */}
            <div className="card-actions justify-end mt-6">
              {editing ? (
                <>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setEditing(false);
                      setImageFile(null); /* Reset changes? */
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline btn-primary"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
