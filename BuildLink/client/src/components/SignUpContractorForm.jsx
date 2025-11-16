import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

const SignUpContractorForm = ({ onClose }) => {
  const { setToken, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "JazzCash", // Default value
    paymentAccount: "",
    cnic: "",
    email: "",
    password: "",
    team: [], // Array to hold team members
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // State for the temporary team member being added
  const [currentMemberName, setCurrentMemberName] = useState("");
  const [currentMemberSkill, setCurrentMemberSkill] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Team Member Logic ---
  const handleAddMember = () => {
    if (!currentMemberName || !currentMemberSkill) {
      alert("Please enter both name and skill for the team member.");
      return;
    }
    // Add the current member to the team array
    setFormData({
      ...formData,
      team: [
        ...formData.team,
        { name: currentMemberName, skill: currentMemberSkill },
      ],
    });
    // Clear the input fields
    setCurrentMemberName("");
    setCurrentMemberSkill("");
  };

  const handleRemoveMember = (indexToRemove) => {
    setFormData({
      ...formData,
      team: formData.team.filter((_, index) => index !== indexToRemove),
    });
  };
  // --- End Team Member Logic ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the backend /api/auth/signup/contractor endpoint
      const response = await API.post("/auth/signup/contractor", formData);

      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);

      setLoading(false);
      onClose(); // Close the modal
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Sign up failed. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-bold text-lg">Create a Contractor Account</h3>

      {/* Basic Info Fields (similar to User form) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {" "}
        {/* Use grid for better layout */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Business/Full Name</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Your Name/Company"
            className="input input-bordered w-full input-sm"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="email@example.com"
            className="input input-bordered w-full input-sm"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Choose a password"
            className="input input-bordered w-full input-sm"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Phone Number</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="03001234567"
            className="input input-bordered w-full input-sm"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Address</span>
        </label>
        <input
          type="text"
          name="address"
          placeholder="Your Business Address"
          className="input input-bordered w-full input-sm"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Receiving Payment Method</span>
          </label>
          <select
            name="paymentMethod"
            className="select select-bordered w-full select-sm"
            value={formData.paymentMethod}
            onChange={handleChange}
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
            placeholder="Your Account/Phone for payments"
            className="input input-bordered w-full input-sm"
            value={formData.paymentAccount}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">CNIC (Optional)</span>
        </label>
        <input
          type="text"
          name="cnic"
          placeholder="xxxxx-xxxxxxx-x"
          className="input input-bordered w-full input-sm"
          value={formData.cnic}
          onChange={handleChange}
        />
      </div>

      {/* --- Team Details Section --- */}
      <div className="divider">Team Details</div>
      {/* List of added team members */}
      {formData.team.length > 0 && (
        <div className="space-y-2 mb-4">
          <label className="label">
            <span className="label-text font-semibold">Current Team:</span>
          </label>
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
      {/* Form to add a new team member */}
      <label className="label">
        <span className="label-text font-semibold">Add Team Member:</span>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
        <div className="form-control">
          <label className="label py-0">
            <span className="label-text text-xs">Name</span>
          </label>
          <input
            type="text"
            placeholder="Member Name"
            className="input input-bordered input-sm w-full"
            value={currentMemberName}
            onChange={(e) => setCurrentMemberName(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label py-0">
            <span className="label-text text-xs">Skill</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Plumber, Electrician"
            className="input input-bordered input-sm w-full"
            value={currentMemberSkill}
            onChange={(e) => setCurrentMemberSkill(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline btn-accent md:mt-4" // Added margin top for medium screens
          onClick={handleAddMember}
        >
          Add Person
        </button>
      </div>
      {/* --- End Team Details --- */}

      {/* Error Message */}
      {error && (
        <div role="alert" className="alert alert-error text-sm p-3 mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="form-control mt-6">
        <button type="submit" className="btn btn-secondary" disabled={loading}>
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Sign Up as Contractor"
          )}
        </button>
      </div>
    </form>
  );
};

export default SignUpContractorForm;
