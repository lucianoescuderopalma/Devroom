package com.devroom.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GitHubUserDTO {
    private Long id;
    private String login;
    private String name;
    private String email;
    private String bio;
    private String location;
    @JsonProperty("avatar_url")
    private String avatarUrl;
    @JsonProperty("html_url")
    private String htmlUrl;
    private Integer followers;
    private Integer following;
    @JsonProperty("public_repos")
    private Integer publicRepos;
}