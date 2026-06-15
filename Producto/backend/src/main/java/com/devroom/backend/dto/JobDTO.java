package com.devroom.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class JobDTO {
    private String id;
    private String title;
    private String description;
    private String companyName;
    private String location;
    private String salaryRange;
    private String modality;
    private Boolean isActive;
    private LocalDateTime publishedAt;
    private LocalDateTime expiresAt;
    private Long postedByUserId;
    private String postedByUsername;
    private String postedByAvatarUrl;
    private long applicantsCount;
}
