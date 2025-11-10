import React, { useState } from "react";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobResults, setJobResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [matchResults, setMatchResults] = useState({});

  // 📂 Handle Resume File Selection
  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  // ⬆️ Upload Resume (confirmation only)
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return alert("Please select a resume first!");

    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) alert("✅ " + data.message);
      else alert("❌ Error: " + (data.error || "Upload failed"));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong while uploading!");
    }
  };

  // 🔍 Fetch Jobs
  const handleFetchJobs = async () => {
    if (!jobTitle.trim()) return alert("Please enter a job title!");
    setLoading(true);
    setJobResults([]);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/jobs?title=${encodeURIComponent(jobTitle)}`
      );
      const data = await res.json();

      if (data.jobs) setJobResults(data.jobs);
      else alert("No jobs found.");
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch jobs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Check Resume–Job Skill Match
  const handleCheckMatch = async (job) => {
    if (!resumeFile) return alert("Please upload your resume first!");

    const formData = new FormData();
    formData.append("file", resumeFile);

    const skills = Array.isArray(job.skills)
      ? job.skills.join(", ")
      : job.skills || "";

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/match-resume?job_skills=${encodeURIComponent(skills)}`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (res.ok && data.match_percentage !== undefined) {
        setMatchResults((prev) => ({ ...prev, [job._id || job.id]: data }));
      } else alert("Failed to calculate match score.");
    } catch (error) {
      console.error("Match error:", error);
      alert("Server error while checking resume match.");
    }
  };

  // 📝 Apply to a Job (FastAPI integration)
  const handleApply = async (job) => {
    if (!resumeFile) return alert("Please upload your resume before applying!");

    const seekerName = prompt("Enter your full name:");
    const seekerEmail = prompt("Enter your email address:");
    if (!seekerName || !seekerEmail)
      return alert("Name and email are required!");

    const formData = new FormData();
    formData.append("job_title", job.title);
    formData.append("recruiter_email", job.recruiter_email || "recruiter@example.com");
    formData.append("seeker_name", seekerName);
    formData.append("seeker_email", seekerEmail);
    formData.append("resume", resumeFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/apply-job", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Application submitted successfully!");
        setAppliedJobs((prev) => [...prev, job._id || job.id]);
      } else alert("❌ Failed: " + (data.error || "Unknown error"));
    } catch (error) {
      console.error("Apply error:", error);
    }
  };

  return (
    <div className="user-dashboard-container">
      <h2 className="dashboard-heading">🎯 Job Seeker Dashboard</h2>

      {/* Resume Upload Section */}
      <div className="upload-section">
        <label htmlFor="resumeUpload" className="upload-label">
          Upload Your Resume:
        </label>
        <input
          type="file"
          id="resumeUpload"
          accept=".pdf,.docx,.txt"
          onChange={handleResumeChange}
        />
        <button onClick={handleResumeUpload} className="upload-btn">
          Upload
        </button>
        {resumeFile && <p>📄 {resumeFile.name}</p>}
      </div>

      {/* Job Search Section */}
      <div className="job-search-section">
        <input
          type="text"
          placeholder="Enter Job Title (e.g. React Developer)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="job-input"
        />
        <button className="search-btn" onClick={handleFetchJobs} disabled={loading}>
          {loading ? "Searching..." : "Search Jobs"}
        </button>
      </div>

      {/* Job Results */}
      <div className="job-results">
        {loading && <p>Fetching jobs...</p>}
        {!loading && jobResults.length > 0 && (
          <div>
            <h3>🔎 Found {jobResults.length} Jobs:</h3>
            {jobResults.map((job, index) => {
              const jobId = job._id || job.id;
              const matchData = matchResults[jobId];

              return (
                <div key={index} className="job-card">
                  <h4>{job.title}</h4>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Salary:</strong> {job.salary}</p>
                  <p>
                    <strong>Skills:</strong>{" "}
                    {Array.isArray(job.skills)
                      ? job.skills.join(", ")
                      : job.skills}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {job.description?.slice(0, 250)}...
                  </p>

                  {/* Resume Match Button */}
                  <button
                    className="match-btn"
                    onClick={() => handleCheckMatch(job)}
                  >
                    Check Resume Match
                  </button>

                  {/* Match Result */}
                  {matchData && (
                    <div className="match-result">
                      <p><strong>Match Score:</strong> {matchData.match_percentage}%</p>
                      <p><strong>Status:</strong> {matchData.status}</p>
                      <p>
                        ✅ <strong>Found Skills:</strong>{" "}
                        {matchData.found_skills.join(", ") || "None"}
                      </p>
                      <p>
                        ⚠️ <strong>Missing Skills:</strong>{" "}
                        {matchData.missing_skills.join(", ") || "None"}
                      </p>

                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{
                            width: `${matchData.match_percentage}%`,
                            backgroundColor:
                              matchData.match_percentage >= 70
                                ? "#00c853"
                                : matchData.match_percentage >= 50
                                ? "#ffb300"
                                : "#ff5252",
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Apply Button */}
                  <button
                    className={`apply-btn ${
                      appliedJobs.includes(jobId) ? "applied" : ""
                    }`}
                    onClick={() => handleApply(job)}
                    disabled={appliedJobs.includes(jobId)}
                  >
                    {appliedJobs.includes(jobId) ? "Applied ✅" : "Apply Now"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {!loading && jobResults.length === 0 && (
          <p>No jobs found yet. Try searching!</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
