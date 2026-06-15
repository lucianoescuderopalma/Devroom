package com.devroom.backend.service;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.devroom.backend.dto.CreateJobDTO;
import com.devroom.backend.dto.JobApplicationDTO;
import com.devroom.backend.dto.JobDTO;
import com.devroom.backend.entity.Job;
import com.devroom.backend.entity.JobApplication;
import com.devroom.backend.entity.User;
import com.devroom.backend.repository.JobApplicationRepository;
import com.devroom.backend.repository.JobRepository;
import com.devroom.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock private JobRepository jobRepository;
    @Mock private JobApplicationRepository applicationRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private JobService jobService;

    private User owner;
    private User otherUser;
    private Job activeJob;
    private CreateJobDTO createDTO;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1L);
        owner.setUsername("empresa_dev");

        otherUser = new User();
        otherUser.setId(2L);
        otherUser.setUsername("candidato");

        activeJob = Job.builder()
                .id("job-uuid-001")
                .title("Backend Developer")
                .companyName("DevRoom Inc.")
                .modality("Remoto")
                .isActive(true)
                .user(owner)
                .build();

        createDTO = new CreateJobDTO();
        createDTO.setTitle("Backend Developer");
        createDTO.setDescription("Spring Boot + PostgreSQL");
        createDTO.setCompanyName("DevRoom Inc.");
        createDTO.setModality("Remoto");
    }

    // ─── listActiveJobs ───────────────────────────────────────────────────────

    // TC-JB01: sin filtros — retorna todas las ofertas activas
    @Test
    void listActiveJobs_NoFilters_ReturnsAll() {
        when(jobRepository.findByIsActiveTrue()).thenReturn(List.of(activeJob));
        when(applicationRepository.countByJob(activeJob)).thenReturn(3L);

        List<JobDTO> result = jobService.listActiveJobs(null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Backend Developer");
        assertThat(result.get(0).getApplicantsCount()).isEqualTo(3L);
    }

    // TC-JB02: filtro por modalidad — excluye jobs que no coinciden
    @Test
    void listActiveJobs_FilterByModality_ReturnsOnlyMatching() {
        Job remoteJob = Job.builder().id("j1").title("Dev Remoto")
                .modality("Remoto").isActive(true).user(owner).build();
        Job onsiteJob = Job.builder().id("j2").title("Dev Presencial")
                .modality("Presencial").isActive(true).user(owner).build();

        when(jobRepository.findByIsActiveTrue()).thenReturn(List.of(remoteJob, onsiteJob));
        when(applicationRepository.countByJob(remoteJob)).thenReturn(0L);

        List<JobDTO> result = jobService.listActiveJobs("Remoto", null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getModality()).isEqualTo("Remoto");
    }

    // TC-JB03: filtro por búsqueda — coincide con título o empresa
    @Test
    void listActiveJobs_FilterBySearch_ReturnsMatching() {
        when(jobRepository.findByIsActiveTrue()).thenReturn(List.of(activeJob));
        when(applicationRepository.countByJob(activeJob)).thenReturn(0L);

        List<JobDTO> result = jobService.listActiveJobs(null, "devroom");

        assertThat(result).hasSize(1); // coincide en companyName
    }

    // ─── createJob ────────────────────────────────────────────────────────────

    // TC-JB04: crea oferta exitosamente y la retorna
    @Test
    void createJob_ValidUser_ReturnsCreatedJob() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(jobRepository.save(any(Job.class))).thenReturn(activeJob);
        when(applicationRepository.countByJob(activeJob)).thenReturn(0L);

        JobDTO result = jobService.createJob(1L, createDTO);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Backend Developer");
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    // TC-JB05: usuario inexistente al crear — lanza RuntimeException
    @Test
    void createJob_UserNotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.createJob(99L, createDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");

        verify(jobRepository, never()).save(any());
    }

    // ─── updateJob ────────────────────────────────────────────────────────────

    // TC-JB06: dueño actualiza su propia oferta — éxito
    @Test
    void updateJob_Owner_UpdatesSuccessfully() {
        when(jobRepository.findById("job-uuid-001")).thenReturn(Optional.of(activeJob));
        when(jobRepository.save(activeJob)).thenReturn(activeJob);
        when(applicationRepository.countByJob(activeJob)).thenReturn(0L);

        CreateJobDTO updateDTO = new CreateJobDTO();
        updateDTO.setTitle("Senior Backend Developer");

        JobDTO result = jobService.updateJob(1L, "job-uuid-001", updateDTO);

        assertThat(result).isNotNull();
        assertThat(activeJob.getTitle()).isEqualTo("Senior Backend Developer");
    }

    // TC-JB07: usuario que NO es dueño intenta actualizar — lanza RuntimeException
    @Test
    void updateJob_NotOwner_ThrowsException() {
        when(jobRepository.findById("job-uuid-001")).thenReturn(Optional.of(activeJob));

        assertThatThrownBy(() ->
                jobService.updateJob(2L, "job-uuid-001", createDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("permiso");

        verify(jobRepository, never()).save(any());
    }

    // ─── deleteJob ────────────────────────────────────────────────────────────

    // TC-JB08: dueño elimina su propia oferta — se llama delete
    @Test
    void deleteJob_Owner_DeletesSuccessfully() {
        when(jobRepository.findById("job-uuid-001")).thenReturn(Optional.of(activeJob));

        jobService.deleteJob(1L, "job-uuid-001");

        verify(jobRepository, times(1)).delete(activeJob);
    }

    // TC-JB09: usuario que NO es dueño intenta eliminar — lanza RuntimeException
    @Test
    void deleteJob_NotOwner_ThrowsException() {
        when(jobRepository.findById("job-uuid-001")).thenReturn(Optional.of(activeJob));

        assertThatThrownBy(() ->
                jobService.deleteJob(2L, "job-uuid-001"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("permiso");

        verify(jobRepository, never()).delete(any());
    }

    // ─── applyToJob ───────────────────────────────────────────────────────────

    // TC-JB10: postulación exitosa — guarda application con status PENDING
    @Test
    void applyToJob_ValidRequest_SavesApplication() {
        JobApplication app = JobApplication.builder()
                .id("app-001")
                .user(otherUser)
                .job(activeJob)
                .status("PENDING")
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(otherUser));
        when(jobRepository.findById("job-uuid-001")).thenReturn(Optional.of(activeJob));
        when(applicationRepository.existsByUserAndJob(otherUser, activeJob)).thenReturn(false);
        when(applicationRepository.save(any(JobApplication.class))).thenReturn(app);

        JobApplicationDTO result = jobService.applyToJob(2L, "job-uuid-001");

        assertThat(result.getStatus()).isEqualTo("PENDING");
        verify(applicationRepository, times(1)).save(any(JobApplication.class));
    }

    // TC-JB11: postulación duplicada — lanza RuntimeException
    @Test
    void applyToJob_AlreadyApplied_ThrowsException() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(otherUser));
        when(jobRepository.findById("job-uuid-001")).thenReturn(Optional.of(activeJob));
        when(applicationRepository.existsByUserAndJob(otherUser, activeJob)).thenReturn(true);

        assertThatThrownBy(() ->
                jobService.applyToJob(2L, "job-uuid-001"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Ya aplicaste");

        verify(applicationRepository, never()).save(any());
    }

    // ─── getApplications ─────────────────────────────────────────────────────

    // TC-JB12: dueño consulta postulantes — retorna lista
    @Test
    void getApplications_Owner_ReturnsList() {
        JobApplication app = JobApplication.builder()
                .id("app-001").user(otherUser).job(activeJob).status("PENDING").build();

        when(jobRepository.findById("job-uuid-001")).thenReturn(Optional.of(activeJob));
        when(applicationRepository.findByJob(activeJob)).thenReturn(List.of(app));

        List<JobApplicationDTO> result = jobService.getApplications(1L, "job-uuid-001");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getApplicantUsername()).isEqualTo("candidato");
    }

    // TC-JB13: NO dueño consulta postulantes — lanza RuntimeException
    @Test
    void getApplications_NotOwner_ThrowsException() {
        when(jobRepository.findById("job-uuid-001")).thenReturn(Optional.of(activeJob));

        assertThatThrownBy(() ->
                jobService.getApplications(2L, "job-uuid-001"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("permiso");
    }
}