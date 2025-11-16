import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

// --- MOCK DATA (NOW WITH ALL JOBS) ---
const mockJobs = {
  plumber: [
    { _id: "job1", title: "Fix Leaky Faucet", adminFixedPrice: 1500 },
    { _id: "job2", title: "Install New Toilet", adminFixedPrice: 5000 },
    { _id: "job3", title: "Unclog Drain", adminFixedPrice: 2500 },
  ],
  electrician: [
    { _id: "job4", title: "Install Ceiling Fan", adminFixedPrice: 3000 },
    { _id: "job5", title: "Fix Faulty Switch", adminFixedPrice: 1200 },
    { _id: "job6", title: "New Wiring for a Room", adminFixedPrice: 10000 },
  ],
  carpenter: [
    { _id: "job7", title: "Make Wooden Table", adminFixedPrice: 8000 },
    { _id: "job8", title: "Install Wooden Door", adminFixedPrice: 6000 },
    { _id: "job9", title: "Repair Wooden Bed", adminFixedPrice: 4000 },
  ],
  "foundation-work": [
    { _id: "job10", title: "Lay Concrete Foundation", adminFixedPrice: 50000 },
    { _id: "job11", title: "Excavation Services", adminFixedPrice: 25000 },
  ],
  tiling: [
    { _id: "job12", title: "Install Bathroom Tiles", adminFixedPrice: 9000 },
    { _id: "job13", title: "Kitchen Floor Tiling", adminFixedPrice: 12000 },
  ],
  painter: [
    // <-- NEW DATA
    {
      _id: "job14",
      title: "Paint Interior Room (per room)",
      adminFixedPrice: 7000,
    },
    { _id: "job15", title: "Exterior Wall Painting", adminFixedPrice: 20000 },
  ],
  masonry: [
    // <-- NEW DATA
    { _id: "job16", title: "Build Brick Wall", adminFixedPrice: 15000 },
    { _id: "job17", title: "Plastering Services", adminFixedPrice: 8000 },
  ],
  "structural-steel": [
    // <-- NEW DATA
    { _id: "job18", title: "Erect Steel Frame", adminFixedPrice: 75000 },
    { _id: "job19", title: "Steel Reinforcement Work", adminFixedPrice: 40000 },
  ],
};
// --------------------------------------------------------------------

const ServiceJobPage = () => {
  const { serviceName } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setJobs(mockJobs[serviceName] || []);
      setLoading(false);
    }, 500);
  }, [serviceName]);

  const pageTitle =
    serviceName.charAt(0).toUpperCase() +
    serviceName.slice(1).replace(/-/g, " ");

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2 text-center">
        Services for {pageTitle}
      </h1>
      <p className="text-center text-neutral-content mb-8">
        Select a job to find available contractors.
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Link to={`/job/${job._id}`} key={job._id}>
                <div className="card card-side bg-base-100 shadow-lg transform transition duration-300 hover:bg-base-200 hover:shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-center">
                      <h2 className="card-title">{job.title}</h2>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold text-primary">
                          Rs {job.adminFixedPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-neutral-content">
                          Fixed Price
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center">
              <p>
                No jobs found for this service. Please try another category or
                search term.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceJobPage;
