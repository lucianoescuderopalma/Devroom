package com.devroom.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devroom.backend.dto.ProfileStatsDTO;
import com.devroom.backend.security.JwtUtil;
import com.devroom.backend.service.ProfileStatsService;

@RestController
@RequestMapping("/api/profile")
public class ProfileStatsController {

    private final ProfileStatsService statsService;
    private final JwtUtil jwtUtil;

    public ProfileStatsController(ProfileStatsService statsService, JwtUtil jwtUtil) {
        this.statsService = statsService;
        this.jwtUtil = jwtUtil;
    }

    private Long extractUserId(String authHeader) {
        return jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
    }

    @GetMapping("/stats")
    public ResponseEntity<ProfileStatsDTO> getMyStats(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        return ResponseEntity.ok(statsService.getStatsForUser(userId));
    }
}