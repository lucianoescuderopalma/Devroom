package com.devroom.backend.controller;

import com.devroom.backend.dto.AuthResponse;
import com.devroom.backend.dto.UserProfileDTO;
import com.devroom.backend.security.JwtUtil;
import com.devroom.backend.service.AuthService;
import com.devroom.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, UserService userService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/github/callback")
    public ResponseEntity<AuthResponse> githubCallback(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (code == null || code.isBlank()) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(authService.authenticateWithGitHub(code));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMe(@RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(userService.getProfileById(userId, userId));
    }
}
