package com.devroom.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devroom.backend.entity.Cv;

public interface CvRepository extends JpaRepository<Cv, String> {

    List<Cv> findByUserId(Long userId);

    // Nuevo: último CV del usuario según updatedAt
    Optional<Cv> findTopByUserIdOrderByUpdatedAtDesc(Long userId);
}