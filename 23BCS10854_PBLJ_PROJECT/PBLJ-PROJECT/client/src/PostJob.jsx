import React, { useState } from "react";

const PostJob = ({ onJobPosted }) => {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    skills: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobData.title || !jobData.company || !jobData.description) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/recruiter/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...jobData,
          skills: jobData.skills.split(",").map((s) => s.trim()),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Job posted successfully!");
        setJobData({
          title: "",
          company: "",
          location: "",
          salary: "",
          skills: "",
          description: "",
        });
        onJobPosted && onJobPosted();
      } else {
        alert("❌ Failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error while posting job!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="post-job-form" onSubmit={handleSubmit}>
      <h2>📝 Post New Job</h2>
      <input type="text" name="title" placeholder="Job Title" value={jobData.title} onChange={handleChange} required />
      <input type="text" name="company" placeholder="Company Name" value={jobData.company} onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" value={jobData.location} onChange={handleChange} />
      <input type="text" name="salary" placeholder="Salary Range" value={jobData.salary} onChange={handleChange} />
      <input type="text" name="skills" placeholder="Skills (comma separated)" value={jobData.skills} onChange={handleChange} />
      <textarea name="description" placeholder="Job Description" rows="4" value={jobData.description} onChange={handleChange} required />
      <button type="submit" disabled={loading}>{loading ? "Posting..." : "Post Job"}</button>
    </form>
  );
};

export default PostJob;
