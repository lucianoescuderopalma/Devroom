package com.devroom.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillStatDTO {

    private String name;       // Java, React, etc.
    private long reposCount;   // cuántos repos usan este lenguaje
    private double pct;        // porcentaje sobre el total de repos
}