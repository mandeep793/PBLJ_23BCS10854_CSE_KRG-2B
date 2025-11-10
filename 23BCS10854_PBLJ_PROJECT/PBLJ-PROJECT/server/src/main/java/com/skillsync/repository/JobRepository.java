package com.skillsync.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.skillsync.model.Job;

import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByTitleContainingIgnoreCase(String title);
}