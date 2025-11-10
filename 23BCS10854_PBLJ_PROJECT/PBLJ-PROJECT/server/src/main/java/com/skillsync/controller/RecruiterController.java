package com.skillsync.controller;

import com.skillsync.model.Job;
import com.skillsync.model.Application;
import com.skillsync.repository.JobRepository;
import com.skillsync.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // ✅ Create a job post
    @PostMapping("/create") 
    public Job createJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }

    // ✅ Get all jobs
    @GetMapping("/jobs")
    public List<Job> getJobs() {
        return jobRepository.findAll();
    }

    // ✅ Get applicants for a specific job
    @GetMapping("/applicants/{jobId}")
    public List<Application> getApplicants(@PathVariable String jobId) {
        return applicationRepository.findByJobId(jobId);
    }
}
