import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const location = useLocation();

  const dashboardLinks = [
    { path: "/dashboard/admin", label: "Pending Payments" },
    { path: "/dashboard/admin/disputes", label: "Manage Disputes" },
    // Add more admin sections as needed later
    // { path: '/dashboard/admin/users', label: 'Manage Users' },
    // { path: '/dashboard/admin/contractors', label: 'Manage Contractors' },
    // { path: '/dashboard/admin/jobs', label: 'Manage Jobs' },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* --- Page Content --- */}
      <div className="drawer-content flex flex-col items-start p-4">
        <label
          htmlFor="admin-drawer"
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

        {/* The Outlet will render the correct page (e.g., AdminPendingPayments) */}
        <div className="w-full">
          <Outlet /> {/* <-- THIS IS THE CHANGE */}
        </div>
      </div>

      {/* --- Sidebar Menu --- */}
      <div className="drawer-side">
        <label
          htmlFor="admin-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="menu-title text-lg font-bold">Admin Dashboard</li>
          {dashboardLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={
                  location.pathname === link.path ||
                  (link.path === "/dashboard/admin" &&
                    location.pathname.startsWith("/dashboard/admin/"))
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

export default AdminDashboard;
