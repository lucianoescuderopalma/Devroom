package com.devroom.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GitHubRepoDTO {
    private Long id;
    private String name;
    private String description;

    @JsonProperty("html_url")
    private String htmlUrl;

    private String language;

    @JsonProperty("stargazers_count")
    private Integer stargazersCount;

    @JsonProperty("forks_count")
    private Integer forksCount;

    @JsonProperty("private")
    private Boolean isPrivate;

    @JsonProperty("updated_at")
    private String updatedAt;
}
