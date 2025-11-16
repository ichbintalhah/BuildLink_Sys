import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate for search

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Hook to change pages programmatically

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to the service/job page based on the search term
      // We'll build this page later. The URL structure matches your blueprint.
      // Example: searching "Carpenter" goes to /service/carpenter
      navigate(`/service/${searchTerm.trim().toLowerCase()}`);
    }
  };

  return (
    <div>
      {/* --- Hero Section (Carousel) --- */}
      {/* Note: You need to add images to your public folder for this */}
      {/* Example: client/public/images/hero1.jpg */}
      <div className="carousel w-full h-64 md:h-96 rounded-box shadow-lg mb-8">
        <div id="slide1" className="carousel-item relative w-full">
          {/* Replace with your actual image paths */}
          <img
            src="/images/hero1.jpg"
            className="w-full object-cover"
            alt="Construction Site"
          />
          {/* Optional Text Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center bg-black bg-opacity-50 p-4 rounded">
            <h2 className="text-2xl font-bold">Quality Construction</h2>
            <p>Building your dreams, one brick at a time.</p>
          </div>
          {/* Navigation Arrows */}
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" className="btn btn-circle btn-sm">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle btn-sm">
              ❯
            </a>
          </div>
        </div>
        {/* --- Add more slides as needed --- */}
        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="/images/hero2.jpg"
            className="w-full object-cover"
            alt="Renovation Project"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center bg-black bg-opacity-50 p-4 rounded">
            <h2 className="text-2xl font-bold">Expert Renovations</h2>
            <p>Transforming spaces, enhancing lives.</p>
          </div>
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle btn-sm">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle btn-sm">
              ❯
            </a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <img
            src="/images/hero3.jpg"
            className="w-full object-cover"
            alt="Modification Work"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center bg-black bg-opacity-50 p-4 rounded">
            <h2 className="text-2xl font-bold">Custom Modifications</h2>
            <p>Tailored solutions for your unique needs.</p>
          </div>
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle btn-sm">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle btn-sm">
              ❯
            </a>
          </div>
        </div>
      </div>

      {/* --- Search Bar --- */}
      <form onSubmit={handleSearch} className="mb-12 max-w-lg mx-auto">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="What service do you need? (e.g., Plumber, Carpenter)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            Search
          </button>
        </label>
      </form>

      {/* --- Main Categories Section --- */}
      <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Heavy Construction */}
        <Link to="/category/heavy-construction">
          {" "}
          {/* Link to the category page */}
          <div className="card bg-base-100 shadow-xl image-full transform transition duration-300 hover:scale-105">
            <figure>
              <img
                src="/images/cat-heavy.jpg"
                alt="Heavy Construction"
                className="object-cover h-48 w-full"
              />
            </figure>
            <div className="card-body justify-end">
              {" "}
              {/* Aligns text to bottom */}
              <h2 className="card-title text-white">Heavy Construction</h2>
              <p className="text-white text-sm">
                Large-scale projects, foundations, structural work.
              </p>
            </div>
          </div>
        </Link>

        {/* Card 2: Renovation */}
        <Link to="/category/renovation">
          <div className="card bg-base-100 shadow-xl image-full transform transition duration-300 hover:scale-105">
            <figure>
              <img
                src="/images/cat-reno.jpg"
                alt="Renovation"
                className="object-cover h-48 w-full"
              />
            </figure>
            <div className="card-body justify-end">
              <h2 className="card-title text-white">Renovation</h2>
              <p className="text-white text-sm">
                Home & office updates, remodeling, improvements.
              </p>
            </div>
          </div>
        </Link>

        {/* Card 3: Modification */}
        <Link to="/category/modification">
          <div className="card bg-base-100 shadow-xl image-full transform transition duration-300 hover:scale-105">
            <figure>
              <img
                src="/images/cat-mod.jpg"
                alt="Modification"
                className="object-cover h-48 w-full"
              />
            </figure>
            <div className="card-body justify-end">
              <h2 className="card-title text-white">Modification</h2>
              <p className="text-white text-sm">
                Small upgrades, custom work, repairs.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
