import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

// --- MOCK DATA (FULLY COMPLETED) ---
const mockSubCategories = {
  "heavy-construction": [
    {
      name: "Foundation Work",
      image: "https://placehold.co/600x400/7c3aed/white?text=Foundation",
    },
    {
      name: "Structural Steel",
      image: "https://placehold.co/600x400/7c3aed/white?text=Steel",
    },
    {
      name: "Masonry",
      image: "https://placehold.co/600x400/7c3aed/white?text=Masonry",
    },
  ],
  renovation: [
    {
      name: "Plumber",
      image: "https://placehold.co/600x400/1d4ed8/white?text=Plumber",
    },
    {
      name: "Electrician",
      image: "https://placehold.co/600x400/1d4ed8/white?text=Electrician",
    },
    {
      name: "Carpenter",
      image: "https://placehold.co/600x400/1d4ed8/white?text=Carpenter",
    },
    {
      name: "Painter",
      image: "https://placehold.co/600x400/1d4ed8/white?text=Painter",
    },
  ],
  modification: [
    {
      name: "Cabinet Making",
      image: "https://placehold.co/600x400/be123c/white?text=Cabinets",
    },
    {
      name: "Flooring",
      image: "https://placehold.co/600x400/be123c/white?text=Flooring",
    },
    {
      name: "Tiling",
      image: "https://placehold.co/600x400/be123c/white?text=Tiling",
    },
  ],
};
// --------------------------------------------------------------------

const SubCategoryPage = () => {
  const { categoryName } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSubCategories(mockSubCategories[categoryName] || []);
      setLoading(false);
    }, 500);
  }, [categoryName]);

  const pageTitle = categoryName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-center">{pageTitle}</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subCategories.map((subCat) => (
            <Link
              to={`/service/${subCat.name.toLowerCase().replace(/\s+/g, "-")}`}
              key={subCat.name}
            >
              <div className="card bg-base-100 shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                <figure>
                  <img
                    src={subCat.image}
                    alt={subCat.name}
                    className="h-40 w-full object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title justify-center">{subCat.name}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoryPage;
