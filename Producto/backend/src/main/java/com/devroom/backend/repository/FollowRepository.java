package com.devroom.backend.repository;

import com.devroom.backend.entity.Follow;
import com.devroom.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, String> {
    boolean existsByFollowerAndFollowedUser(User follower, User followedUser);
    Optional<Follow> findByFollowerAndFollowedUser(User follower, User followedUser);
    List<Follow> findByFollower(User follower);
    List<Follow> findByFollowedUser(User followedUser);
    long countByFollower(User follower);
    long countByFollowedUser(User followedUser);
}
