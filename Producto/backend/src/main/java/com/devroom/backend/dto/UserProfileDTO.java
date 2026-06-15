package com.devroom.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserProfileDTO {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String avatarUrl;
    private String bio;
    private String location;
    private String role;
    private String githubUrl;
    private long followersCount;
    private long followingCount;
    private boolean isFollowing;
}
