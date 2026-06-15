package com.devroom.backend.repository;

import com.devroom.backend.entity.Job;
import com.devroom.backend.entity.JobApplication;
import com.devroom.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, String> {
    boolean existsByUserAndJob(User user, Job job);
    List<JobApplication> findByJob(Job job);
    long countByJob(Job job);
}
