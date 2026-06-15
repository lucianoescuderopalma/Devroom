package com.devroom.backend.controller;

import com.devroom.backend.dto.CreateJobDTO;
import com.devroom.backend.dto.JobApplicationDTO;
import com.devroom.backend.dto.JobDTO;
import com.devroom.backend.security.JwtUtil;
import com.devroom.backend.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final JwtUtil jwtUtil;

    public JobController(JobService jobService, JwtUtil jwtUtil) {
        this.jobService = jobService;
        this.jwtUtil = jwtUtil;
    }

    private Long extractUserId(String authHeader) {
        return jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
    }

    @GetMapping
    public ResponseEntity<List<JobDTO>> listJobs(
            @RequestParam(required = false) String modality,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(jobService.listActiveJobs(modality, search));
    }

    @PostMapping
    public ResponseEntity<JobDTO> createJob(
            @RequestBody CreateJobDTO dto,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(jobService.createJob(extractUserId(authHeader), dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJob(@PathVariable String id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDTO> updateJob(
            @PathVariable String id,
            @RequestBody CreateJobDTO dto,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(jobService.updateJob(extractUserId(authHeader), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteJob(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        jobService.deleteJob(extractUserId(authHeader), id);
        return ResponseEntity.ok(Map.of("message", "Oferta eliminada"));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<JobApplicationDTO> applyToJob(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(jobService.applyToJob(extractUserId(authHeader), id));
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<List<JobApplicationDTO>> getApplications(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(jobService.getApplications(extractUserId(authHeader), id));
    }
}
