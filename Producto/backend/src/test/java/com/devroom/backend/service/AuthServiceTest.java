package com.devroom.backend.service;

import com.devroom.backend.dto.AuthResponse;
import com.devroom.backend.dto.GitHubUserDTO;
import com.devroom.backend.entity.User;
import com.devroom.backend.repository.UserRepository;
import com.devroom.backend.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private GitHubService gitHubService;
    @Mock private UserRepository userRepository;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks private AuthService authService;

    private GitHubUserDTO githubUser;
    private User existingUser;

    @BeforeEach
    void setUp() {
        // Simula la respuesta de la API de GitHub
        githubUser = new GitHubUserDTO();
        githubUser.setId(12345L);
        githubUser.setLogin("lescudero");
        githubUser.setName("Luciano Escudero");
        githubUser.setEmail("luciano@devroom.cl");
        githubUser.setAvatarUrl("https://avatars.github.com/u/12345");
        githubUser.setHtmlUrl("https://github.com/lescudero");

        // Usuario que ya existe en la BD
        existingUser = new User();
        existingUser.setId(1L);
        existingUser.setGithubId("12345");
        existingUser.setUsername("lescudero");
        existingUser.setName("Luciano Escudero");
        existingUser.setEmail("luciano@devroom.cl");
    }

    // TC-AU01: usuario NUEVO — se crea en BD y retorna token
    @Test
    void authenticateWithGitHub_NewUser_CreatesUserAndReturnsToken() {
        when(gitHubService.exchangeCodeForToken("code-nuevo"))
                .thenReturn("gh-access-token");
        when(gitHubService.getGitHubUser("gh-access-token"))
                .thenReturn(githubUser);
        when(userRepository.findByGithubId("12345"))
                .thenReturn(Optional.empty());           // no existe aún
        when(userRepository.save(any(User.class)))
                .thenReturn(existingUser);               // simula el INSERT
        when(jwtUtil.generateToken(1L, "lescudero"))
                .thenReturn("jwt-token-nuevo");

        AuthResponse response = authService.authenticateWithGitHub("code-nuevo");

        // Verifica la respuesta
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt-token-nuevo");
        assertThat(response.getUsername()).isEqualTo("lescudero");
        assertThat(response.getUserId()).isEqualTo(1L);

        // Verifica que se guardó exactamente una vez (el INSERT)
        verify(userRepository, times(1)).save(any(User.class));
    }

    // TC-AU02: usuario EXISTENTE — se actualiza y retorna nuevo token
    @Test
    void authenticateWithGitHub_ExistingUser_UpdatesAndReturnsToken() {
        when(gitHubService.exchangeCodeForToken("code-existente"))
                .thenReturn("gh-access-token-2");
        when(gitHubService.getGitHubUser("gh-access-token-2"))
                .thenReturn(githubUser);
        when(userRepository.findByGithubId("12345"))
                .thenReturn(Optional.of(existingUser));  // ya existe
        when(userRepository.save(existingUser))
                .thenReturn(existingUser);               // simula el UPDATE
        when(jwtUtil.generateToken(1L, "lescudero"))
                .thenReturn("jwt-token-existente");

        AuthResponse response = authService.authenticateWithGitHub("code-existente");

        assertThat(response.getToken()).isEqualTo("jwt-token-existente");
        assertThat(response.getUserId()).isEqualTo(1L);

        // El save debe haberse llamado con el usuario existente (UPDATE, no INSERT nuevo)
        verify(userRepository, times(1)).save(existingUser);
    }

    // TC-AU03: código inválido de GitHub — lanza excepción
    @Test
    void authenticateWithGitHub_InvalidCode_ThrowsException() {
        when(gitHubService.exchangeCodeForToken("codigo-malo"))
                .thenThrow(new RuntimeException(
                        "No se pudo obtener el access token de GitHub"));

        assertThatThrownBy(() ->
                authService.authenticateWithGitHub("codigo-malo"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("access token");

        // Nunca debe llegar a tocar la BD si GitHub falla
        verify(userRepository, never()).save(any());
    }
}