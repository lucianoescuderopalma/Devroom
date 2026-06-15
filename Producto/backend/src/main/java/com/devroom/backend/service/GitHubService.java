package com.devroom.backend.service;

import com.devroom.backend.dto.GitHubUserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class GitHubService {

    @Value("${github.client-id}")
    private String clientId;

    @Value("${github.client-secret}")
    private String clientSecret;

    @Value("${github.redirect-uri}")
    private String redirectUri;

    private final RestTemplate restTemplate = new RestTemplate();

    public String exchangeCodeForToken(String code) {
        String url = "https://github.com/login/oauth/access_token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        Map<String, String> body = Map.of(
            "client_id", clientId,
            "client_secret", clientSecret,
            "code", code,
            "redirect_uri", redirectUri
        );

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (response.getBody() != null && response.getBody().containsKey("access_token")) {
            return (String) response.getBody().get("access_token");
        }

        throw new RuntimeException("No se pudo obtener el access token de GitHub");
    }

    public GitHubUserDTO getGitHubUser(String accessToken) {
        String url = "https://api.github.com/user";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.set("Accept", "application/vnd.github+json");

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<GitHubUserDTO> response = restTemplate.exchange(
            url, HttpMethod.GET, request, GitHubUserDTO.class
        );

        return response.getBody();
    }
}