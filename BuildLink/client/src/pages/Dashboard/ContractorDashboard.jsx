import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const ContractorDashboard = () => {
  const location = useLocation();

  const dashboardLinks = [
    { path: "/dashboard/contractor", label: "Job Requests" },
    { path: "/dashboard/contractor/active", label: "Active Jobs" },
    { path: "/dashboard/contractor/history", label: "Job History" },
    { path: "/dashboard/contractor/portfolio", label: "My Portfolio" },
    { path: "/dashboard/contractor/earnings", label: "Earnings" },
    { path: "/dashboard/contractor/profile", label: "My Profile" },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="contractor-drawer" type="checkbox" className="drawer-toggle" />

      {/* --- Page Content --- */}
      <div className="drawer-content flex flex-col items-start p-4">
        <label
          htmlFor="contractor-drawer"
          className="btn btn-primary drawer-button lg:hidden mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
          Open Menu
        </label>

        {/* The Outlet will render the correct page (e.g., JobRequests) */}
        <div className="w-full">
          <Outlet /> {/* <-- THIS IS THE CHANGE */}
        </div>
      </div>

      {/* --- Sidebar Menu --- */}
      <div className="drawer-side">
        <label
          htmlFor="contractor-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="menu-title text-lg font-bold">Contractor Dashboard</li>
          {dashboardLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                // Updated className logic for correct highlighting
                className={
                  // Exact match or default route match
                  location.pathname === link.path ||
                  (link.path === "/dashboard/contractor" &&
                    location.pathname.startsWith("/dashboard/contractor/"))
                    ? "active"
                    : ""
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContractorDashboard;
