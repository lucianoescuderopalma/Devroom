// com/devroom/backend/dto/CvSkillDTO.java
package com.devroom.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CvSkillDTO {
    private String name;
    private String level;   // "Básico" | "Intermedio" | "Avanzado"
    private int repoCount;  // cuántos repos usan este lenguaje
}