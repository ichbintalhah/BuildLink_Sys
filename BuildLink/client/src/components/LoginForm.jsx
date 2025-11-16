import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

const LoginForm = ({ onClose }) => {
  const { setToken, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-lg">Login to your Account</h3>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="email@example.com"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="Your password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
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
      <div className="form-control mt-6">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
