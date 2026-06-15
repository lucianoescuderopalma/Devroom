package com.devroom.backend.controller;

import com.devroom.backend.dto.RepoDTO;
import com.devroom.backend.security.JwtUtil;
import com.devroom.backend.service.RepositoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RepositoryController {

    private final RepositoryService repositoryService;
    private final JwtUtil jwtUtil;

    public RepositoryController(RepositoryService repositoryService, JwtUtil jwtUtil) {
        this.repositoryService = repositoryService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/users/{username}/repos")
    public ResponseEntity<List<RepoDTO>> getUserRepos(@PathVariable String username) {
        return ResponseEntity.ok(repositoryService.getReposByUsername(username));
    }

    @PostMapping("/repos/sync")
    public ResponseEntity<Map<String, Object>> syncRepos(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
        int count = repositoryService.syncReposFromGitHub(userId);
        return ResponseEntity.ok(Map.of("message", "Repos sincronizados", "count", count));
    }
}
