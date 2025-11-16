import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const UserDashboard = () => {
  const location = useLocation();

  const dashboardLinks = [
    { path: "/dashboard/user", label: "Current Bookings" },
    { path: "/dashboard/user/history", label: "Booking History" },
    { path: "/dashboard/user/profile", label: "My Profile" },
    { path: "/dashboard/user/transactions", label: "Transactions" },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* --- Page Content --- */}
      <div className="drawer-content flex flex-col items-start p-4">
        <label
          htmlFor="my-drawer-2"
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

        {/* The Outlet will render the correct page (e.g., CurrentBookings) */}
        <div className="w-full">
          <Outlet />
        </div>
      </div>

      {/* --- Sidebar Menu --- */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="menu-title text-lg font-bold">User Dashboard</li>
          {dashboardLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                // This logic makes sure the correct link is highlighted
                className={
                  location.pathname === link.path ||
                  (link.path === "/dashboard/user" &&
                    location.pathname.startsWith("/dashboard/user/"))
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

export default UserDashboard;
