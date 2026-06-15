package com.devroom.backend.controller;

import com.devroom.backend.dto.UpdateUserDTO;
import com.devroom.backend.dto.UserProfileDTO;
import com.devroom.backend.security.JwtUtil;
import com.devroom.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    private Long extractUserId(String authHeader) {
        return jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileDTO> getProfile(
            @PathVariable String username,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(userService.getProfileByUsername(username, extractUserId(authHeader)));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @RequestBody UpdateUserDTO dto,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(userService.updateProfile(extractUserId(authHeader), dto));
    }

    @PostMapping("/{username}/follow")
    public ResponseEntity<Map<String, String>> follow(
            @PathVariable String username,
            @RequestHeader("Authorization") String authHeader) {
        userService.follow(extractUserId(authHeader), username);
        return ResponseEntity.ok(Map.of("message", "Siguiendo a " + username));
    }

    @DeleteMapping("/{username}/follow")
    public ResponseEntity<Map<String, String>> unfollow(
            @PathVariable String username,
            @RequestHeader("Authorization") String authHeader) {
        userService.unfollow(extractUserId(authHeader), username);
        return ResponseEntity.ok(Map.of("message", "Dejaste de seguir a " + username));
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<List<UserProfileDTO>> getFollowers(
            @PathVariable String username,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(userService.getFollowers(username, extractUserId(authHeader)));
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<List<UserProfileDTO>> getFollowing(
            @PathVariable String username,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(userService.getFollowing(username, extractUserId(authHeader)));
    }
}
