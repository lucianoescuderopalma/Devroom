package com.devroom.backend.service;

import com.devroom.backend.dto.CreateJobDTO;
import com.devroom.backend.dto.JobApplicationDTO;
import com.devroom.backend.dto.JobDTO;
import com.devroom.backend.entity.Job;
import com.devroom.backend.entity.JobApplication;
import com.devroom.backend.entity.User;
import com.devroom.backend.repository.JobApplicationRepository;
import com.devroom.backend.repository.JobRepository;
import com.devroom.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository,
                      JobApplicationRepository applicationRepository,
                      UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public List<JobDTO> listActiveJobs(String modality, String search) {
        return jobRepository.findByIsActiveTrue().stream()
                .filter(j -> modality == null || modality.equalsIgnoreCase(j.getModality()))
                .filter(j -> search == null ||
                        j.getTitle().toLowerCase().contains(search.toLowerCase()) ||
                        (j.getCompanyName() != null && j.getCompanyName().toLowerCase().contains(search.toLowerCase())))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public JobDTO createJob(Long userId, CreateJobDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Job job = Job.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .companyName(dto.getCompanyName())
                .location(dto.getLocation())
                .salaryRange(dto.getSalaryRange())
                .modality(dto.getModality())
                .expiresAt(dto.getExpiresAt())
                .user(user)
                .build();
        return mapToDTO(jobRepository.save(job));
    }

    public JobDTO getJobById(String id) {
        return mapToDTO(jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada")));
    }

    public JobDTO updateJob(Long userId, String jobId, CreateJobDTO dto) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
        if (!job.getUser().getId().equals(userId))
            throw new RuntimeException("No tienes permiso para editar esta oferta");
        if (dto.getTitle() != null) job.setTitle(dto.getTitle());
        if (dto.getDescription() != null) job.setDescription(dto.getDescription());
        if (dto.getCompanyName() != null) job.setCompanyName(dto.getCompanyName());
        if (dto.getLocation() != null) job.setLocation(dto.getLocation());
        if (dto.getSalaryRange() != null) job.setSalaryRange(dto.getSalaryRange());
        if (dto.getModality() != null) job.setModality(dto.getModality());
        if (dto.getExpiresAt() != null) job.setExpiresAt(dto.getExpiresAt());
        return mapToDTO(jobRepository.save(job));
    }

    public void deleteJob(Long userId, String jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
        if (!job.getUser().getId().equals(userId))
            throw new RuntimeException("No tienes permiso para eliminar esta oferta");
        jobRepository.delete(job);
    }

    public JobApplicationDTO applyToJob(Long userId, String jobId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
        if (applicationRepository.existsByUserAndJob(user, job))
            throw new RuntimeException("Ya aplicaste a esta oferta");
        JobApplication app = JobApplication.builder()
                .user(user)
                .job(job)
                .status("PENDING")
                .build();
        return mapAppToDTO(applicationRepository.save(app));
    }

    public List<JobApplicationDTO> getApplications(Long userId, String jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
        if (!job.getUser().getId().equals(userId))
            throw new RuntimeException("No tienes permiso para ver las aplicaciones");
        return applicationRepository.findByJob(job).stream()
                .map(this::mapAppToDTO)
                .collect(Collectors.toList());
    }

    private JobDTO mapToDTO(Job job) {
        return JobDTO.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .companyName(job.getCompanyName())
                .location(job.getLocation())
                .salaryRange(job.getSalaryRange())
                .modality(job.getModality())
                .isActive(job.getIsActive())
                .publishedAt(job.getPublishedAt())
                .expiresAt(job.getExpiresAt())
                .postedByUserId(job.getUser().getId())
                .postedByUsername(job.getUser().getUsername())
                .postedByAvatarUrl(job.getUser().getAvatarUrl())
                .applicantsCount(applicationRepository.countByJob(job))
                .build();
    }

    private JobApplicationDTO mapAppToDTO(JobApplication app) {
        return JobApplicationDTO.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .applicantId(app.getUser().getId())
                .applicantUsername(app.getUser().getUsername())
                .applicantAvatarUrl(app.getUser().getAvatarUrl())
                .status(app.getStatus())
                .matchScore(app.getMatchScore())
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
