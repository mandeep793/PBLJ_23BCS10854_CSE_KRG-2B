package com.skillsync.controller;

import com.skillsync.model.Application;
import com.skillsync.model.Job;
import com.skillsync.repository.ApplicationRepository;
import com.skillsync.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/jobseeker")
public class JobSeekerController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // ✅ Search jobs by title
    @GetMapping("/search")
    public List<Job> searchJobs(@RequestParam String title) {
        return jobRepository.findByTitleContainingIgnoreCase(title);
    }

    // ✅ Apply to a job
    @PostMapping("/apply")
    public Application applyJob(@RequestBody Application application) {
        return applicationRepository.save(application);
    }
}
