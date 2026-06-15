package com.devroom.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileStatsDTO {

    private long reposCount;
    private long totalCommits;
    private long distinctSkills;
    private List<SkillStatDTO> skills;
}