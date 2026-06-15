package com.devroom.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CvDTO {

    private String id;
    private Integer score;
    private String summary;
    private String pdfUrl;
    private Boolean isPublic;
    private Boolean isOnline;
    private LocalDateTime generatedAt;
    private LocalDateTime updatedAt;

    // Campos generados dinámicamente
    private String fullName;
    private String headline;
    private String location;
    private List<CvSkillDTO> skills;
    private List<CvProjectDTO> projects;
}