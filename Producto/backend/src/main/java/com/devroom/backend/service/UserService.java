package com.devroom.backend.service;

import com.devroom.backend.dto.UpdateUserDTO;
import com.devroom.backend.dto.UserProfileDTO;
import com.devroom.backend.entity.Follow;
import com.devroom.backend.entity.User;
import com.devroom.backend.repository.FollowRepository;
import com.devroom.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    public UserService(UserRepository userRepository, FollowRepository followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }

    public UserProfileDTO getProfileByUsername(String username, Long requesterId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
        return mapToDTO(user, requesterId);
    }

    public UserProfileDTO getProfileById(Long userId, Long requesterId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return mapToDTO(user, requesterId);
    }

    public UserProfileDTO updateProfile(Long userId, UpdateUserDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getBio() != null) user.setBio(dto.getBio());
        if (dto.getLocation() != null) user.setLocation(dto.getLocation());
        if (dto.getRole() != null) user.setRole(dto.getRole());
        return mapToDTO(userRepository.save(user), userId);
    }

    public void follow(Long followerId, String targetUsername) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        User target = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + targetUsername));
        if (follower.getId().equals(target.getId()))
            throw new RuntimeException("No puedes seguirte a ti mismo");
        if (followRepository.existsByFollowerAndFollowedUser(follower, target))
            throw new RuntimeException("Ya sigues a este usuario");
        followRepository.save(Follow.builder().follower(follower).followedUser(target).build());
    }

    public void unfollow(Long followerId, String targetUsername) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        User target = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + targetUsername));
        Follow follow = followRepository.findByFollowerAndFollowedUser(follower, target)
                .orElseThrow(() -> new RuntimeException("No sigues a este usuario"));
        followRepository.delete(follow);
    }

    public List<UserProfileDTO> getFollowers(String username, Long requesterId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return followRepository.findByFollowedUser(user).stream()
                .map(f -> mapToDTO(f.getFollower(), requesterId))
                .collect(Collectors.toList());
    }

    public List<UserProfileDTO> getFollowing(String username, Long requesterId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return followRepository.findByFollower(user).stream()
                .map(f -> mapToDTO(f.getFollowedUser(), requesterId))
                .collect(Collectors.toList());
    }

    private UserProfileDTO mapToDTO(User user, Long requesterId) {
        long followers = followRepository.countByFollowedUser(user);
        long following = followRepository.countByFollower(user);
        boolean isFollowing = false;
        if (requesterId != null && !requesterId.equals(user.getId())) {
            User requester = userRepository.findById(requesterId).orElse(null);
            if (requester != null)
                isFollowing = followRepository.existsByFollowerAndFollowedUser(requester, user);
        }
        return UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .location(user.getLocation())
                .role(user.getRole())
                .githubUrl(user.getGithubUrl())
                .followersCount(followers)
                .followingCount(following)
                .isFollowing(isFollowing)
                .build();
    }
}
