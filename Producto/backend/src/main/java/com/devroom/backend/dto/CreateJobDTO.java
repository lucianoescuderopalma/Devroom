package com.devroom.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateJobDTO {
    private String title;
    private String description;
    private String companyName;
    private String location;
    private String salaryRange;
    private String modality;
    private LocalDateTime expiresAt;
}
