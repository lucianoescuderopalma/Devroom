package com.devroom.backend.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.devroom.backend.dto.ProfileStatsDTO;
import com.devroom.backend.dto.SkillStatDTO;
import com.devroom.backend.entity.RepositoryEntity;
import com.devroom.backend.entity.User;
import com.devroom.backend.repository.RepositoryEntityRepository;
import com.devroom.backend.repository.UserRepository;

@Service
public class ProfileStatsService {

    private final RepositoryEntityRepository repoRepository;
    private final UserRepository userRepository;

    public ProfileStatsService(RepositoryEntityRepository repoRepository,
                               UserRepository userRepository) {
        this.repoRepository = repoRepository;
        this.userRepository = userRepository;
    }

    public ProfileStatsDTO getStatsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<RepositoryEntity> repos = repoRepository.findByUser(user);

        long reposCount = repos.size();

        long totalCommits = repos.stream()
                .map(RepositoryEntity::getCommits)
                .filter(c -> c != null)
                .mapToLong(Integer::longValue)
                .sum();

        // Agrupar por lenguaje principal
        Map<String, Long> byLang = repos.stream()
                .map(RepositoryEntity::getMainLanguage)
                .filter(lang -> lang != null && !lang.isBlank())
                .collect(Collectors.groupingBy(
                        lang -> lang,
                        Collectors.counting()
                ));

        long totalReposWithLang = byLang.values().stream().mapToLong(Long::longValue).sum();

        List<SkillStatDTO> skills = byLang.entrySet().stream()
                .map(e -> {
                    double pct = totalReposWithLang == 0
                            ? 0.0
                            : (e.getValue() * 100.0) / totalReposWithLang;
                    return SkillStatDTO.builder()
                            .name(e.getKey())
                            .reposCount(e.getValue())
                            .pct(Math.round(pct)) // redondear a entero
                            .build();
                })
                // ordenar por porcentaje descendente
                .sorted((a, b) -> Double.compare(b.getPct(), a.getPct()))
                .collect(Collectors.toList());

        return ProfileStatsDTO.builder()
                .reposCount(reposCount)
                .totalCommits(totalCommits)
                .distinctSkills(byLang.size())
                .skills(skills)
                .build();
    }
}