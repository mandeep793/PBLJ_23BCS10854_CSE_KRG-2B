// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 8,
    totalApplications: 23,
    totalRecruiters: 5,
    totalSeekers: 17,
    mostAppliedJob: "Frontend Developer",
  });

  const [jobs, setJobs] = useState([
    { id: 1, title: "Frontend Developer", recruiter: "recruiter1@gmail.com" },
    { id: 2, title: "Backend Developer", recruiter: "recruiter2@gmail.com" },
  ]);

  const [applications, setApplications] = useState([
    { id: 1, jobTitle: "Frontend Developer", seeker: "mandeep@gmail.com" },
    { id: 2, jobTitle: "Backend Developer", seeker: "aditi@gmail.com" },
  ]);

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🧠 SkillSync Admin Dashboard</h1>
        <p>Manage platform stats, jobs, and applications</p>
      </header>

      <section className="stats-section">
        <div className="stat-card">
          <h3>Total Recruiters</h3>
          <p>{stats.totalRecruiters}</p>
        </div>
        <div className="stat-card">
          <h3>Total Job Seekers</h3>
          <p>{stats.totalSeekers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <p>{stats.totalJobs}</p>
        </div>
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p>{stats.totalApplications}</p>
        </div>
        <div className="stat-card highlight">
          <h3>Most Applied Job</h3>
          <p>{stats.mostAppliedJob}</p>
        </div>
      </section>

      <section className="table-section">
        <h2>📋 All Jobs</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Recruiter Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.recruiter}</td>
                <td>
                  <button className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="table-section">
        <h2>👩‍💻 All Applications</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Seeker Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.jobTitle}</td>
                <td>{app.seeker}</td>
                <td>
                  <button className="btn-delete">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
