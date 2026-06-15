package com.devroom.backend.service;

import com.devroom.backend.dto.FeedActivityDTO;
import com.devroom.backend.entity.FeedActivity;
import com.devroom.backend.entity.Follow;
import com.devroom.backend.entity.User;
import com.devroom.backend.repository.FeedActivityRepository;
import com.devroom.backend.repository.FollowRepository;
import com.devroom.backend.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedService {

    private final FeedActivityRepository feedRepository;
    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public FeedService(FeedActivityRepository feedRepository,
                       FollowRepository followRepository,
                       UserRepository userRepository) {
        this.feedRepository = feedRepository;
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    public List<FeedActivityDTO> getFeedForUser(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<User> following = followRepository.findByFollower(user).stream()
                .map(Follow::getFollowedUser)
                .collect(Collectors.toList());
        following.add(user);

        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        return feedRepository.findByUserIn(following, pageable).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private FeedActivityDTO mapToDTO(FeedActivity activity) {
        return FeedActivityDTO.builder()
                .id(activity.getId())
                .actorUsername(activity.getUser().getUsername())
                .actorAvatarUrl(activity.getUser().getAvatarUrl())
                .type(activity.getType())
                .content(activity.getContent())
                .refId(activity.getRefId())
                .createdAt(activity.getCreatedAt())
                .build();
    }
}
