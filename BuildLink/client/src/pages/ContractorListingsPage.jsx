import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

// --- MOCK DATA (FULLY EXPANDED) ---
const mockJobDetails = {
  job1: { _id: "job1", title: "Fix Leaky Faucet", requiredSkill: "Plumber" },
  job2: { _id: "job2", title: "Install New Toilet", requiredSkill: "Plumber" },
  job7: { _id: "job7", title: "Make Wooden Table", requiredSkill: "Carpenter" },
  job8: {
    _id: "job8",
    title: "Install Wooden Door",
    requiredSkill: "Carpenter",
  },
  job10: {
    _id: "job10",
    title: "Lay Concrete Foundation",
    requiredSkill: "Foundation Work",
  },
  job11: {
    _id: "job11",
    title: "Excavation Services",
    requiredSkill: "Foundation Work",
  },
  job12: {
    _id: "job12",
    title: "Install Bathroom Tiles",
    requiredSkill: "Tiling",
  },
  job13: {
    _id: "job13",
    title: "Kitchen Floor Tiling",
    requiredSkill: "Tiling",
  },
  job14: {
    _id: "job14",
    title: "Paint Interior Room (per room)",
    requiredSkill: "Painter",
  }, // <-- NEW
  job15: {
    _id: "job15",
    title: "Exterior Wall Painting",
    requiredSkill: "Painter",
  }, // <-- NEW
  job16: { _id: "job16", title: "Build Brick Wall", requiredSkill: "Masonry" }, // <-- NEW
  job17: {
    _id: "job17",
    title: "Plastering Services",
    requiredSkill: "Masonry",
  }, // <-- NEW
  job18: {
    _id: "job18",
    title: "Erect Steel Frame",
    requiredSkill: "Structural Steel",
  }, // <-- NEW
  job19: {
    _id: "job19",
    title: "Steel Reinforcement Work",
    requiredSkill: "Structural Steel",
  }, // <-- NEW
};

const mockContractors = [
  {
    _id: "c1",
    name: "Ali Khan Plumbing",
    skills: ["Plumber"],
    rating: 4.5,
    tags: ["Trusted"],
    profileImage: "https://placehold.co/100x100/3498db/white?text=A",
  },
  {
    _id: "c2",
    name: "Saqib Maintenance",
    skills: ["Plumber", "Electrician", "Tiling"],
    rating: 4.8,
    tags: [],
    profileImage: "https://placehold.co/100x100/2ecc71/white?text=S",
  },
  {
    _id: "c3",
    name: "Javaid Carpentry Works",
    skills: ["Carpenter"],
    rating: 4.2,
    tags: [],
    profileImage: "https://placehold.co/100x100/e67e22/white?text=J",
  },
  {
    _id: "c4",
    name: "Lahore Wood Crafts",
    skills: ["Carpenter"],
    rating: 3.5,
    tags: ["Less Trusted"],
    profileImage: "https://placehold.co/100x100/f1c40f/white?text=L",
  },
  {
    _id: "c5",
    name: "Rana Builders",
    skills: ["Foundation Work", "Masonry"],
    rating: 4.9,
    tags: ["Trusted", "Heavy Duty"],
    profileImage: "https://placehold.co/100x100/9b59b6/white?text=R",
  },
  {
    _id: "c6",
    name: "Punjab Tiling Co.",
    skills: ["Tiling", "Flooring"],
    rating: 4.4,
    tags: [],
    profileImage: "https://placehold.co/100x100/e74c3c/white?text=P",
  },
  {
    _id: "c7",
    name: "City Painters",
    skills: ["Painter"],
    rating: 4.6,
    tags: ["Trusted"],
    profileImage: "https://placehold.co/100x100/1abc9c/white?text=C",
  }, // <-- NEW
  {
    _id: "c8",
    name: "Faisal Steel Fabricators",
    skills: ["Structural Steel"],
    rating: 4.7,
    tags: [],
    profileImage: "https://placehold.co/100x100/34495e/white?text=F",
  }, // <-- NEW
];
// --------------------------------------------------------------------

const ContractorListingsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const foundJob = mockJobDetails[jobId];
      setJob(foundJob);

      if (foundJob) {
        const qualifiedContractors = mockContractors.filter((c) =>
          c.skills
            .map((s) => s.toLowerCase().replace(/\s+/g, "-"))
            .includes(foundJob.requiredSkill.toLowerCase().replace(/\s+/g, "-"))
        );
        setContractors(qualifiedContractors);
      }
      setLoading(false);
    }, 800);
  }, [jobId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!job) {
    return <div className="text-center">Job not found.</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2 text-center">
        Available Contractors
      </h1>
      <p className="text-center text-neutral-content mb-8">
        Showing contractors for:{" "}
        <span className="font-bold text-primary">{job.title}</span>
      </p>

      <div className="space-y-4">
        {contractors.length > 0 ? (
          contractors.map((contractor) => (
            <Link to={`/contractor/${contractor._id}`} key={contractor._id}>
              <div className="card lg:card-side bg-base-100 shadow-lg transform transition duration-300 hover:bg-base-200 hover:shadow-xl">
                <div className="p-4 flex items-center">
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={contractor.profileImage}
                        alt={`${contractor.name}'s profile`}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="card-title">{contractor.name}</h2>
                      <div className="rating rating-sm mt-1">
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
                        <span className="ml-2 text-sm">
                          ({contractor.rating})
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {contractor.tags.map((tag) => (
                        <div
                          key={tag}
                          className={`badge ${
                            tag === "Less Trusted"
                              ? "badge-error"
                              : "badge-success"
                          } badge-outline`}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center p-10 bg-base-200 rounded-box">
            <p>
              Sorry, no contractors are currently available for this specific
              job.
            </p>
            <p className="text-sm text-neutral-content mt-2">
              Please try another job or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorListingsPage;
