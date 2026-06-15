// com/devroom/backend/dto/CvProjectDTO.java
package com.devroom.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CvProjectDTO {
    private String name;
    private String description;
    private String url;
    private String mainTech;
}