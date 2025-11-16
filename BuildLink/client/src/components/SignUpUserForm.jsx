import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

const SignUpUserForm = ({ onClose }) => {
  const { setToken, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "None", // Default value
    paymentAccount: "",
    cnic: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to update state when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the backend /api/auth/signup/user endpoint
      const response = await API.post("/auth/signup/user", formData);

      // If signup is successful:
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
      {" "}
      {/* Smaller spacing */}
      <h3 className="font-bold text-lg">Create a User Account</h3>
      {/* Name */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="input input-bordered w-full input-sm"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      {/* Email */}
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
      {/* Password */}
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
      {/* Phone */}
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
      {/* Address */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Address</span>
        </label>
        <input
          type="text"
          name="address"
          placeholder="Your Address"
          className="input input-bordered w-full input-sm"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      {/* Payment Method Dropdown */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Preferred Payment Method</span>
        </label>
        <select
          name="paymentMethod"
          className="select select-bordered w-full select-sm"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="None">None</option>
          <option value="JazzCash">JazzCash</option>
          <option value="EasyPaisa">EasyPaisa</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>
      {/* Payment Account (Only shown if a method is selected) */}
      {formData.paymentMethod !== "None" && (
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">
              Account Number / Phone (for Payment)
            </span>
          </label>
          <input
            type="text"
            name="paymentAccount"
            placeholder="Your Account/Phone"
            className="input input-bordered w-full input-sm"
            value={formData.paymentAccount}
            onChange={handleChange}
            required={formData.paymentMethod !== "None"}
          />
        </div>
      )}
      {/* CNIC */}
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
      {/* Error Message */}
      {error && (
        <div role="alert" className="alert alert-error text-sm p-3">
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
          {" "}
          {/* Used secondary color */}
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Sign Up as User"
          )}
        </button>
      </div>
    </form>
  );
};

export default SignUpUserForm;
