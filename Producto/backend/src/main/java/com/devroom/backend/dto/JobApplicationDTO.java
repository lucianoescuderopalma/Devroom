package com.devroom.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class JobApplicationDTO {
    private String id;
    private String jobId;
    private String jobTitle;
    private Long applicantId;
    private String applicantUsername;
    private String applicantAvatarUrl;
    private String status;
    private Integer matchScore;
    private LocalDateTime appliedAt;
}
