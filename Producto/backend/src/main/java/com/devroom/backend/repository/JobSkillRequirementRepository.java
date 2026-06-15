package com.devroom.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devroom.backend.entity.JobSkillRequirement;

public interface JobSkillRequirementRepository extends JpaRepository<JobSkillRequirement, String> {
    List<JobSkillRequirement> findByJobId(String jobId);
    List<JobSkillRequirement> findBySkillNameContainingIgnoreCase(String skillName);
}