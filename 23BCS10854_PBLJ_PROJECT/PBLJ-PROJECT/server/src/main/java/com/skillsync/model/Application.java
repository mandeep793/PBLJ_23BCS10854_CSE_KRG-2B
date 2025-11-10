package com.skillsync.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "applications")
public class Application {
    @Id
    private String id;

    private String jobId;
    private String name;
    private String email;
    private String resumeUrl; // optional field

    public Application() {}

    public Application(String jobId, String name, String email, String resumeUrl) {
        this.jobId = jobId;
        this.name = name;
        this.email = email;
        this.resumeUrl = resumeUrl;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
}
