import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthContext } from "../context/AuthContext";

// --- MOCK DATA (NOW COMPLETE WITH ALL CONTRACTORS) ---
const mockContractors = {
  c1: {
    _id: "c1",
    name: "Ali Khan Plumbing",
    skills: ["Plumber"],
    rating: 4.5,
    tags: ["Trusted"],
    profileImage: "https://placehold.co/150x150/3498db/white?text=A",
    phone: "0300-1234567",
    address: "Model Town, Lahore",
    portfolio: [
      "https://placehold.co/600x400/3498db/white?text=Work+1",
      "https://placehold.co/600x400/3498db/white?text=Work+2",
      "https://placehold.co/600x400/3498db/white?text=Work+3",
    ],
    reviews: [
      {
        user: "Ahmed",
        rating: 5,
        comment: "Very professional and quick service.",
      },
      { user: "Fatima", rating: 4, comment: "Good work, but was a bit late." },
    ],
  },
  c2: {
    _id: "c2",
    name: "Saqib Maintenance",
    skills: ["Plumber", "Electrician", "Tiling"],
    rating: 4.8,
    tags: [],
    profileImage: "https://placehold.co/150x150/2ecc71/white?text=S",
    phone: "0321-7654321",
    address: "DHA Phase 5, Lahore",
    portfolio: [
      "https://placehold.co/600x400/2ecc71/white?text=Project+A",
      "https://placehold.co/600x400/2ecc71/white?text=Project+B",
    ],
    reviews: [
      {
        user: "Bilal",
        rating: 5,
        comment: "Excellent work, highly recommended!",
      },
    ],
  },
  c3: {
    _id: "c3",
    name: "Javaid Carpentry Works",
    skills: ["Carpenter"],
    rating: 4.2,
    tags: [],
    profileImage: "https://placehold.co/150x150/e67e22/white?text=J",
    phone: "0333-1122334",
    address: "Gulberg, Lahore",
    portfolio: [
      "https://placehold.co/600x400/e67e22/white?text=Furniture",
      "https://placehold.co/600x400/e67e22/white?text=Doors",
    ],
    reviews: [{ user: "Sarah", rating: 4, comment: "Great craftsmanship." }],
  },
  c4: {
    _id: "c4",
    name: "Lahore Wood Crafts",
    skills: ["Carpenter"],
    rating: 3.5,
    tags: ["Less Trusted"],
    profileImage: "https://placehold.co/150x150/f1c40f/white?text=L",
    phone: "0312-9876543",
    address: "Iqbal Town, Lahore",
    portfolio: ["https://placehold.co/600x400/f1c40f/white?text=Repair+1"],
    reviews: [{ user: "Usman", rating: 3, comment: "Average work quality." }],
  },
  c5: {
    _id: "c5",
    name: "Rana Builders",
    skills: ["Foundation Work", "Masonry"],
    rating: 4.9,
    tags: ["Trusted", "Heavy Duty"],
    profileImage: "https://placehold.co/150x150/9b59b6/white?text=R",
    phone: "0345-5566778",
    address: "Johar Town, Lahore",
    portfolio: [
      "https://placehold.co/600x400/9b59b6/white?text=Site+1",
      "https://placehold.co/600x400/9b59b6/white?text=Site+2",
      "https://placehold.co/600x400/9b59b6/white?text=Site+3",
      "https://placehold.co/600x400/9b59b6/white?text=Site+4",
    ],
    reviews: [
      {
        user: "Imran",
        rating: 5,
        comment: "Top quality work for large projects.",
      },
      {
        user: "Zainab",
        rating: 5,
        comment: "Very reliable and professional team.",
      },
    ],
  },
  c6: {
    _id: "c6",
    name: "Punjab Tiling Co.",
    skills: ["Tiling", "Flooring"],
    rating: 4.4,
    tags: [],
    profileImage: "https://placehold.co/150x150/e74c3c/white?text=P",
    phone: "0301-2345678",
    address: "Wapda Town, Lahore",
    portfolio: [
      "https://placehold.co/600x400/e74c3c/white?text=Bathroom+Tiling",
      "https://placehold.co/600x400/e74c3c/white?text=Kitchen+Flooring",
    ],
    reviews: [
      { user: "Ayesha", rating: 5, comment: "Clean and precise work." },
    ],
  },
  c7: {
    _id: "c7",
    name: "City Painters",
    skills: ["Painter"],
    rating: 4.6,
    tags: ["Trusted"],
    profileImage: "https://placehold.co/150x150/1abc9c/white?text=C",
    phone: "0322-8765432",
    address: "Cantt, Lahore",
    portfolio: [
      "https://placehold.co/600x400/1abc9c/white?text=Interior+Paint",
      "https://placehold.co/600x400/1abc9c/white?text=Exterior+Paint",
    ],
    reviews: [
      {
        user: "Haris",
        rating: 5,
        comment: "Fast, clean, and professional painters.",
      },
    ],
  },
  c8: {
    _id: "c8",
    name: "Faisal Steel Fabricators",
    skills: ["Structural Steel"],
    rating: 4.7,
    tags: [],
    profileImage: "https://placehold.co/150x150/34495e/white?text=F",
    phone: "0334-4455667",
    address: "Kot Lakhpat, Lahore",
    portfolio: [
      "https://placehold.co/600x400/34495e/white?text=Steel+Frame",
      "https://placehold.co/600x400/34495e/white?text=Reinforcement",
    ],
    reviews: [
      { user: "Kashif", rating: 5, comment: "Strong and reliable steel work." },
    ],
  },
};
// --------------------------------------------------------------------

const ContractorProfilePage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setContractor(mockContractors[id] || null);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleBookNow = () => {
    if (user) {
      // If user is logged in, navigate to the new booking form
      navigate(`/booking-form/${id}`);
    } else {
      // If user is a guest, prompt them to log in.
      alert("Please log in or sign up to book a service.");
      // We will improve this later to open the modal automatically
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!contractor) {
    return (
      <div className="text-center p-10">
        <h2>Contractor not found.</h2>
      </div>
    );
  }

  return (
    <div className="bg-base-200 p-4 sm:p-8 rounded-box">
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="avatar">
          <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
            <img
              src={contractor.profileImage}
              alt={`${contractor.name}'s profile`}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-4xl font-bold">{contractor.name}</h1>
            {contractor.tags.map((tag) => (
              <div
                key={tag}
                className={`badge ${
                  tag === "Less Trusted" ? "badge-error" : "badge-success"
                } badge-outline`}
              >
                {tag}
              </div>
            ))}
          </div>
          <div className="rating rating-md mt-2">
            {[...Array(5)].map((_, i) => (
              <input
                key={i}
                type="radio"
                name={`rating-${contractor._id}`}
                className="mask mask-star-2 bg-orange-400"
                disabled
                checked={i < Math.round(contractor.rating)}
              />
            ))}
            <span className="ml-2 font-semibold">({contractor.rating})</span>
          </div>
          <p className="mt-2">
            <strong>Skills:</strong> {contractor.skills.join(", ")}
          </p>
        </div>
      </div>

      {/* --- Action Buttons --- */}
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        <button className="btn btn-primary btn-wide" onClick={handleBookNow}>
          Book Now
        </button>
        <a
          href={`https://wa.me/${import.meta.env.VITE_ADMIN_WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-wide"
        >
          Advisory Visit
        </a>
      </div>

      {/* --- Portfolio Section --- */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Previous Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractor.portfolio.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`Work example ${index + 1}`}
              className="rounded-lg shadow-md object-cover w-full h-48"
            />
          ))}
        </div>
      </div>

      {/* --- User Reviews Section --- */}
      <div>
        <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
        <div className="space-y-4">
          {contractor.reviews && contractor.reviews.length > 0 ? (
            contractor.reviews.map((review, index) => (
              <div key={index} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                        <span>{review.user.substring(0, 2)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold">{review.user}</p>
                      <div className="rating rating-sm">
                        {[...Array(5)].map((_, i) => (
                          <input
                            key={i}
                            type="radio"
                            name={`review-rating-${index}`}
                            className="mask mask-star-2 bg-orange-400"
                            disabled
                            checked={i < review.rating}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-content">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorProfilePage;
