package com.devroom.backend.controller;

import com.devroom.backend.dto.FeedActivityDTO;
import com.devroom.backend.security.JwtUtil;
import com.devroom.backend.service.FeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FeedService feedService;
    private final JwtUtil jwtUtil;

    public FeedController(FeedService feedService, JwtUtil jwtUtil) {
        this.feedService = feedService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<List<FeedActivityDTO>> getFeed(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long userId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(feedService.getFeedForUser(userId, page, size));
    }
}
