import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-10">
      <nav>
        <h6 className="footer-title">Categories</h6>
        <Link to="/categories/heavy-construction" className="link link-hover">
          Heavy Construction
        </Link>
        <Link to="/categories/renovation" className="link link-hover">
          Renovation
        </Link>
        <Link to="/categories/modification" className="link link-hover">
          Modification
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <Link to="/about" className="link link-hover">
          About Us
        </Link>
        <Link to="/chat" className="link link-hover">
          AI Chat
        </Link>
        <a
          href={`https://wa.me/${import.meta.env.VITE_ADMIN_WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          Contact Admin
        </a>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
      </nav>
      <aside>
        <p className="font-bold text-lg">BuildLink</p>
        <p>© 2025 - Your Project, Our Priority.</p>
      </aside>
    </footer>
  );
};

export default Footer;
