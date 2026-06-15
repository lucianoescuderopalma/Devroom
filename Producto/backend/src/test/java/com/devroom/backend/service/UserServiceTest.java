package com.devroom.backend.service;

import com.devroom.backend.dto.UpdateUserDTO;
import com.devroom.backend.dto.UserProfileDTO;
import com.devroom.backend.entity.Follow;
import com.devroom.backend.entity.User;
import com.devroom.backend.repository.FollowRepository;
import com.devroom.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private FollowRepository followRepository;

    @InjectMocks private UserService userService;

    private User userA;   // el perfil que se consulta
    private User userB;   // el que hace las acciones (requester / follower)

    @BeforeEach
    void setUp() {
        userA = new User();
        userA.setId(1L);
        userA.setUsername("lescudero");
        userA.setName("Luciano Escudero");
        userA.setEmail("luciano@devroom.cl");
        userA.setBio("Dev chileno");
        userA.setLocation("Santiago");

        userB = new User();
        userB.setId(2L);
        userB.setUsername("otrodev");
        userB.setName("Otro Dev");
    }

    // ─── getProfileByUsername ─────────────────────────────────────────────────

    // TC-US01: perfil encontrado — retorna DTO con contadores y isFollowing=false
    @Test
    void getProfileByUsername_Found_ReturnsDTO() {
        when(userRepository.findByUsername("lescudero"))
                .thenReturn(Optional.of(userA));
        when(followRepository.countByFollowedUser(userA)).thenReturn(10L);
        when(followRepository.countByFollower(userA)).thenReturn(5L);
        // requesterId == null → isFollowing debe ser false
        UserProfileDTO dto = userService.getProfileByUsername("lescudero", null);

        assertThat(dto.getUsername()).isEqualTo("lescudero");
        assertThat(dto.getFollowersCount()).isEqualTo(10L);
        assertThat(dto.getFollowingCount()).isEqualTo(5L);
        assertThat(dto.isFollowing()).isFalse();
    }

    // TC-US02: perfil no encontrado — lanza RuntimeException
    @Test
    void getProfileByUsername_NotFound_ThrowsException() {
        when(userRepository.findByUsername("fantasma"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                userService.getProfileByUsername("fantasma", null))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("fantasma");
    }

    // TC-US03: requester distinto al perfil → isFollowing refleja la BD
    @Test
    void getProfileByUsername_WithRequester_ReturnsIsFollowingTrue() {
        when(userRepository.findByUsername("lescudero"))
                .thenReturn(Optional.of(userA));
        when(followRepository.countByFollowedUser(userA)).thenReturn(3L);
        when(followRepository.countByFollower(userA)).thenReturn(1L);
        when(userRepository.findById(2L)).thenReturn(Optional.of(userB));
        when(followRepository.existsByFollowerAndFollowedUser(userB, userA))
                .thenReturn(true);

        UserProfileDTO dto = userService.getProfileByUsername("lescudero", 2L);

        assertThat(dto.isFollowing()).isTrue();
    }

    // ─── updateProfile ────────────────────────────────────────────────────────

    // TC-US04: actualiza solo los campos no-null del DTO
    @Test
    void updateProfile_PartialUpdate_OnlyChangesNonNullFields() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(userA));
        when(userRepository.save(userA)).thenReturn(userA);
        when(followRepository.countByFollowedUser(userA)).thenReturn(0L);
        when(followRepository.countByFollower(userA)).thenReturn(0L);

        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setBio("Nueva bio");
        // name y location quedan null → no deben cambiar

        UserProfileDTO result = userService.updateProfile(1L, dto);

        assertThat(userA.getBio()).isEqualTo("Nueva bio");
        assertThat(userA.getName()).isEqualTo("Luciano Escudero"); // sin cambio
        assertThat(userA.getLocation()).isEqualTo("Santiago");     // sin cambio
        verify(userRepository, times(1)).save(userA);
    }

    // TC-US05: updateProfile con usuario inexistente — lanza RuntimeException
    @Test
    void updateProfile_UserNotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                userService.updateProfile(99L, new UpdateUserDTO()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");
    }

    // ─── follow ───────────────────────────────────────────────────────────────

    // TC-US06: follow exitoso — guarda en BD
    @Test
    void follow_ValidUsers_SavesFollow() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(userB));
        when(userRepository.findByUsername("lescudero")).thenReturn(Optional.of(userA));
        when(followRepository.existsByFollowerAndFollowedUser(userB, userA))
                .thenReturn(false);

        userService.follow(2L, "lescudero");

        verify(followRepository, times(1)).save(any(Follow.class));
    }

    // TC-US07: seguirse a sí mismo — lanza RuntimeException
    @Test
    void follow_SelfFollow_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(userA));
        when(userRepository.findByUsername("lescudero")).thenReturn(Optional.of(userA));

        assertThatThrownBy(() ->
                userService.follow(1L, "lescudero"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("ti mismo");

        verify(followRepository, never()).save(any());
    }

    // TC-US08: ya sigue al usuario — lanza RuntimeException
    @Test
    void follow_AlreadyFollowing_ThrowsException() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(userB));
        when(userRepository.findByUsername("lescudero")).thenReturn(Optional.of(userA));
        when(followRepository.existsByFollowerAndFollowedUser(userB, userA))
                .thenReturn(true);

        assertThatThrownBy(() ->
                userService.follow(2L, "lescudero"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Ya sigues");

        verify(followRepository, never()).save(any());
    }

    // ─── unfollow ─────────────────────────────────────────────────────────────

    // TC-US09: unfollow exitoso — elimina de BD
    @Test
    void unfollow_Existing_DeletesFollow() {
        Follow follow = Follow.builder().follower(userB).followedUser(userA).build();
        when(userRepository.findById(2L)).thenReturn(Optional.of(userB));
        when(userRepository.findByUsername("lescudero")).thenReturn(Optional.of(userA));
        when(followRepository.findByFollowerAndFollowedUser(userB, userA))
                .thenReturn(Optional.of(follow));

        userService.unfollow(2L, "lescudero");

        verify(followRepository, times(1)).delete(follow);
    }

    // TC-US10: unfollow sin seguir — lanza RuntimeException
    @Test
    void unfollow_NotFollowing_ThrowsException() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(userB));
        when(userRepository.findByUsername("lescudero")).thenReturn(Optional.of(userA));
        when(followRepository.findByFollowerAndFollowedUser(userB, userA))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                userService.unfollow(2L, "lescudero"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("No sigues");

        verify(followRepository, never()).delete(any());
    }
}