// src/components/RecruiterDashboard.jsx
import React, { useState, useEffect } from "react";
import "./RecruiterDashboard.css";
import PostJob from "../../PostJob.jsx";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState({});
  const [showApplicants, setShowApplicants] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/recruiter/jobs");
      const data = await res.json();
      if (Array.isArray(data.jobs)) setJobs(data.jobs);
      else if (data.jobs) setJobs(data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleViewApplicants = async (jobTitle) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/recruiter/applicants?job_title=${encodeURIComponent(jobTitle)}`
      );
      const data = await res.json();
      setApplicants((prev) => ({ ...prev, [jobTitle]: data.applicants || [] }));
      setShowApplicants(jobTitle);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      alert("Failed to load applicants");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="recruiter-dashboard-container">
      <h2 className="dashboard-heading">Recruiter Dashboard</h2>
      <div className="dashboard-panels">
        <div className="left-panel">
          <PostJob />
        </div>

        <div className="right-panel">
          <h3>📋 Posted Jobs</h3>
          {jobs.length === 0 ? (
            <p>No jobs posted yet.</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id || job._id} className="job-card">
                <h4>{job.title}</h4>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location || "N/A"}</p>
                <p><strong>Salary:</strong> {job.salary || "N/A"}</p>
                <p>
                  <strong>Skills:</strong>{" "}
                  {Array.isArray(job.skills) ? job.skills.join(", ") : job.skills}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {job.description?.slice(0, 150)}...
                </p>
                <button
                  className="view-btn"
                  onClick={() => handleViewApplicants(job.title)}
                >
                  View Applicants
                </button>

                {showApplicants === job.title && (
                  <div className="applicant-list">
                    <h5>👥 Applicants:</h5>
                    {applicants[job.title]?.length > 0 ? (
                      applicants[job.title].map((a, idx) => (
                        <div key={idx} className="applicant-card">
                          <p><strong>Name:</strong> {a.seeker_name}</p>
                          <p><strong>Email:</strong> {a.seeker_email}</p>
                          <a href={a.resume_url} target="_blank" rel="noopener noreferrer">
                            📄 View Resume
                          </a>

                        </div>
                      ))
                    ) : (
                      <p>No applicants yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
