package com.devroom.backend.repository;

import com.devroom.backend.entity.FeedActivity;
import com.devroom.backend.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedActivityRepository extends JpaRepository<FeedActivity, String> {
    List<FeedActivity> findByUserIn(List<User> users, Pageable pageable);
}
