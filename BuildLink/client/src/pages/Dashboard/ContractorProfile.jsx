import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios"; // Needed later for saving
import LoadingSpinner from "../../components/LoadingSpinner";

const ContractorProfile = () => {
  const { user, setUser, loading: authLoading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "",
    paymentAccount: "",
    team: [],
    profileImage: "",
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // State for adding a new team member
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberSkill, setNewMemberSkill] = useState("");

  // Pre-fill form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        paymentMethod: user.paymentMethod || "JazzCash", // Default if not set
        paymentAccount: user.paymentAccount || "",
        team: user.team || [],
        profileImage: user.profileImage || "",
        // Email/CNIC typically not editable from profile
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) =>
        setFormData({ ...formData, profileImage: event.target.result });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // --- Team Member Logic ---
  const handleAddMember = () => {
    if (!newMemberName || !newMemberSkill) {
      alert("Please enter both name and skill for the team member.");
      return;
    }
    setFormData({
      ...formData,
      team: [...formData.team, { name: newMemberName, skill: newMemberSkill }],
    });
    setNewMemberName("");
    setNewMemberSkill("");
  };

  const handleRemoveMember = (indexToRemove) => {
    setFormData({
      ...formData,
      team: formData.team.filter((_, index) => index !== indexToRemove),
    });
  };
  // --- End Team Member Logic ---

  // --- TODO: Implement Backend Saving ---
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    console.log("Saving contractor data:", formData);
    console.log("Image file:", imageFile);

    // --- Backend Call Would Go Here ---
    // 1. If imageFile, upload it -> get imageUrl
    // 2. PUT updated formData (including team array and maybe imageUrl) to /api/contractors/profile
    // 3. Update AuthContext: setUser(updatedContractorData)
    // 4. Turn off editing

    // Simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Profile updated successfully! (Backend integration needed)");
    // In real app: setUser({...user, ...formData, profileImage: newImageUrl });
    setSaving(false);
    setEditing(false);
    setImageFile(null);
    // --- End TODO ---
  };
  // ------------------------------------

  if (authLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">My Contractor Profile</h2>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <form onSubmit={handleSaveChanges}>
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="avatar mb-4">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
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
                  <span className="label-text">Business/Full Name</span>
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
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
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
              {/* Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Receiving Payment Method</span>
                  </label>
                  <select
                    name="paymentMethod"
                    className={`select select-bordered w-full ${
                      !editing ? "select-disabled" : ""
                    }`}
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    disabled={!editing}
                  >
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Account Number / Phone</span>
                  </label>
                  <input
                    type="text"
                    name="paymentAccount"
                    className={`input input-bordered w-full ${
                      !editing ? "input-disabled" : ""
                    }`}
                    value={formData.paymentAccount}
                    onChange={handleChange}
                    readOnly={!editing}
                    required
                  />
                </div>
              </div>
            </div>

            {/* --- Team Details Section (Editable) --- */}
            {editing && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-semibold mb-3">Manage Team</h3>
                {/* List current members */}
                {formData.team.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <ul className="list-disc list-inside">
                      {formData.team.map((member, index) => (
                        <li
                          key={index}
                          className="text-sm flex justify-between items-center"
                        >
                          <span>
                            {member.name} - ({member.skill})
                          </span>
                          <button
                            type="button"
                            className="btn btn-xs btn-error btn-outline"
                            onClick={() => handleRemoveMember(index)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Add new member form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end mt-4 p-4 bg-base-100 rounded-md">
                  <div className="form-control">
                    <label className="label py-0">
                      <span className="label-text text-xs">
                        New Member Name
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Name"
                      className="input input-bordered input-sm w-full"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-0">
                      <span className="label-text text-xs">Skill</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Plumber"
                      className="input input-bordered input-sm w-full"
                      value={newMemberSkill}
                      onChange={(e) => setNewMemberSkill(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline btn-accent md:mt-4"
                    onClick={handleAddMember}
                  >
                    Add Person
                  </button>
                </div>
              </div>
            )}
            {/* --- End Team Details --- */}

            {/* Display Team (Read-only mode) */}
            {!editing && formData.team.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-semibold mb-3">Current Team</h3>
                <ul className="list-disc list-inside">
                  {formData.team.map((member, index) => (
                    <li key={index} className="text-sm">
                      {member.name} - ({member.skill})
                    </li>
                  ))}
                </ul>
              </div>
            )}

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

export default ContractorProfile;
