package com.devroom.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FeedActivityDTO {
    private String id;
    private String actorUsername;
    private String actorAvatarUrl;
    private String type;
    private String content;
    private String refId;
    private LocalDateTime createdAt;
}
