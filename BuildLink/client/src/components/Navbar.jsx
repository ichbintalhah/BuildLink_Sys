import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthModal from "./AuthModal.jsx"; // We'll create this next

const Navbar = () => {
  const { user, setToken, setUser } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const navLinks = (
    <>
      <li>
        <Link to="/categories/heavy-construction">Heavy Construction</Link>
      </li>
      <li>
        <Link to="/categories/renovation">Renovation</Link>
      </li>
      <li>
        <Link to="/categories/modification">Modification</Link>
      </li>
      <li className="divider"></li>
      <li>
        <Link to="/about">About Us</Link>
      </li>
      <li>
        <Link to="/chat">AI Chat</Link>
      </li>
      <li>
        <a
          href={`https://wa.me/${import.meta.env.VITE_ADMIN_WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact (WhatsApp)
        </a>
      </li>
    </>
  );

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
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
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {navLinks}
            </ul>
          </div>
          <Link
            to="/"
            className="btn btn-ghost normal-case text-2xl font-bold text-primary"
          >
            BuildLink
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/chat">AI Chat</Link>
            </li>
            <li>
              <a
                href={`https://wa.me/${import.meta.env.VITE_ADMIN_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User profile"
                    src={
                      user.profileImage ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=random`
                    }
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="menu-title">
                  <span>Welcome, {user.name}!</span>
                </li>
                <li>
                  {/* --- THIS IS THE UPDATED LINK LOGIC --- */}
                  <Link
                    to={
                      user.role === "admin"
                        ? "/dashboard/admin"
                        : user.role === "contractor"
                        ? "/dashboard/contractor"
                        : "/dashboard/user"
                    }
                  >
                    Dashboard
                  </Link>
                  {/* -------------------------------------- */}
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>

      <AuthModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;
