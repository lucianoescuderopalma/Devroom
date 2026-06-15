package com.devroom.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepoDTO {

    private String id;
    private String githubRepoId;
    private String name;
    private String description;
    private String url;
    private String mainLanguage;
    private Integer commits;
    private String scoreLevel;
    private Boolean isPrivate;
    private Integer scoreNumeric;
}