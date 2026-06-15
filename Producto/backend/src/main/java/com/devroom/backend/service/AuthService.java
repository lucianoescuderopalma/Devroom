package com.devroom.backend.service;

import com.devroom.backend.dto.AuthResponse;
import com.devroom.backend.dto.GitHubUserDTO;
import com.devroom.backend.entity.User;
import com.devroom.backend.repository.UserRepository;
import com.devroom.backend.security.JwtUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    private final GitHubService gitHubService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(GitHubService gitHubService,
                       UserRepository userRepository,
                       JwtUtil jwtUtil) {
        this.gitHubService = gitHubService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse authenticateWithGitHub(String code) {
    String accessToken = gitHubService.exchangeCodeForToken(code);
    GitHubUserDTO githubUser = gitHubService.getGitHubUser(accessToken);

    User user = findOrCreateUser(githubUser, accessToken);

    String token = jwtUtil.generateToken(user.getId(), user.getUsername());

    return new AuthResponse(
        token,
        user.getId(),
        user.getUsername(),
        user.getAvatarUrl(),
        user.getName()
    );
}

private User findOrCreateUser(GitHubUserDTO githubUser, String accessToken) {
    String githubId = String.valueOf(githubUser.getId());
    Optional<User> existing = userRepository.findByGithubId(githubId);

    if (existing.isPresent()) {
        User user = existing.get();
        user.setAvatarUrl(githubUser.getAvatarUrl());
        user.setName(githubUser.getName());
        user.setGithubAccessToken(accessToken);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    User newUser = new User();
    newUser.setGithubId(githubId);
    newUser.setUsername(githubUser.getLogin());
    newUser.setName(githubUser.getName());
    newUser.setEmail(githubUser.getEmail());
    newUser.setBio(githubUser.getBio());
    newUser.setLocation(githubUser.getLocation());
    newUser.setAvatarUrl(githubUser.getAvatarUrl());
    newUser.setGithubUrl(githubUser.getHtmlUrl());
    newUser.setGithubAccessToken(accessToken);
    newUser.setCreatedAt(LocalDateTime.now());
    newUser.setUpdatedAt(LocalDateTime.now());
    return userRepository.save(newUser);
}
}