package com.devroom.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devroom.backend.entity.Skill;

public interface SkillRepository extends JpaRepository<Skill, String> {
    List<Skill> findByUserId(Long userId);
    List<Skill> findByNameContainingIgnoreCase(String name);
}