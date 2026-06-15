package com.devroom.backend.service;

import com.devroom.backend.dto.GitHubRepoDTO;
import com.devroom.backend.dto.RepoDTO;
import com.devroom.backend.entity.RepositoryEntity;
import com.devroom.backend.entity.User;
import com.devroom.backend.repository.RepositoryEntityRepository;
import com.devroom.backend.repository.UserRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepositoryService {

    private final RepositoryEntityRepository repoRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public RepositoryService(RepositoryEntityRepository repoRepository,
                             UserRepository userRepository) {
        this.repoRepository = repoRepository;
        this.userRepository = userRepository;
    }

    public List<RepoDTO> getReposByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return repoRepository.findByUser(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public int syncReposFromGitHub(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(user.getGithubAccessToken());
        headers.set("Accept", "application/vnd.github+json");

        ResponseEntity<List<GitHubRepoDTO>> response = restTemplate.exchange(
                "https://api.github.com/user/repos?per_page=100&sort=updated",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<List<GitHubRepoDTO>>() {}
        );

        List<GitHubRepoDTO> ghRepos = response.getBody();
        if (ghRepos == null) return 0;

        // Borramos repos antiguos del usuario y guardamos los nuevos
        repoRepository.deleteByUser(user);

        List<RepositoryEntity> toSave = ghRepos.stream()
                .map(gh -> RepositoryEntity.builder()
                        .githubRepoId(gh.getId() != null ? String.valueOf(gh.getId()) : null)
                        .name(gh.getName())
                        .description(gh.getDescription())
                        .url(gh.getHtmlUrl())
                        .mainLanguage(gh.getLanguage())
                        .isPrivate(Boolean.TRUE.equals(gh.getIsPrivate()))
                        .user(user)
                        .build())
                .collect(Collectors.toList());

        repoRepository.saveAll(toSave);
        return toSave.size();
    }

    private RepoDTO mapToDTO(RepositoryEntity repo) {
        return RepoDTO.builder()
                .id(repo.getId())
                .githubRepoId(repo.getGithubRepoId())
                .name(repo.getName())
                .description(repo.getDescription())
                .url(repo.getUrl())
                .mainLanguage(repo.getMainLanguage())
                .commits(repo.getCommits())
                .scoreLevel(repo.getScoreLevel())
                .isPrivate(repo.getIsPrivate())
                .build();
    }
}