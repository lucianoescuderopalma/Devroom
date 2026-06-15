package com.devroom.backend.service;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import com.devroom.backend.dto.CvDTO;
import com.devroom.backend.dto.CvProjectDTO;
import com.devroom.backend.dto.CvSkillDTO;
import com.devroom.backend.entity.Cv;
import com.devroom.backend.entity.RepositoryEntity;
import com.devroom.backend.entity.User;
import com.devroom.backend.repository.CvRepository;
import com.devroom.backend.repository.RepositoryEntityRepository;
import com.devroom.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.core.io.ClassPathResource;


import java.util.*;
import java.util.stream.Collectors;

@Service
public class CvService {

    private final CvRepository cvRepository;
    private final UserRepository userRepository;
    private final RepositoryEntityRepository repoRepository;

    public CvService(CvRepository cvRepository,
                     UserRepository userRepository,
                     RepositoryEntityRepository repoRepository) {
        this.cvRepository = cvRepository;
        this.userRepository = userRepository;
        this.repoRepository = repoRepository;
    }

    public CvDTO getCurrentCvForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<RepositoryEntity> repos = repoRepository.findByUser(user);

        // Skills: contar repos por lenguaje
        List<CvSkillDTO> skills = buildSkills(repos);

        // Proyectos: hasta 5 repos públicos
        List<CvProjectDTO> projects = buildProjects(repos);

        // Headline automático
        String headline = buildHeadline(user, skills);

        // Summary: si el usuario tiene bio, la usamos; si no, generamos una básica
        String summary = buildSummary(user, skills);

        // Score básico
        int score = calculateScore(user, repos, skills);

        // Si ya hay CV en BD, usar su score/summary personalizados si existen
        Optional<Cv> savedCv = cvRepository.findTopByUserIdOrderByUpdatedAtDesc(userId);
        String id = null;
        String pdfUrl = null;
        Boolean isPublic = false;
        Boolean isOnline = false;

        if (savedCv.isPresent()) {
            Cv cv = savedCv.get();
            id = cv.getId();
            pdfUrl = cv.getPdfUrl();
            isPublic = cv.getIsPublic();
            isOnline = cv.getIsOnline();
            // Preferir el summary guardado si el usuario lo editó
            if (cv.getSummary() != null && !cv.getSummary().isBlank()) {
                summary = cv.getSummary();
            }
            if (cv.getScore() != null) {
                score = cv.getScore();
            }
        }

        return CvDTO.builder()
                .id(id)
                .score(score)
                .summary(summary)
                .pdfUrl(pdfUrl)
                .isPublic(isPublic)
                .isOnline(isOnline)
                .generatedAt(savedCv.map(Cv::getGeneratedAt).orElse(null))
                .updatedAt(savedCv.map(Cv::getUpdatedAt).orElse(null))
                .fullName(user.getName() != null ? user.getName() : user.getUsername())
                .headline(headline)
                .location(user.getLocation())
                .skills(skills)
                .projects(projects)
                .build();
    }

    // ──────────────────────────────────────────────────────────
    // HELPERS PRIVADOS
    // ──────────────────────────────────────────────────────────

    private List<CvSkillDTO> buildSkills(List<RepositoryEntity> repos) {
        // Contar repos por lenguaje
        Map<String, Long> counts = repos.stream()
                .filter(r -> r.getMainLanguage() != null && !r.getMainLanguage().isBlank())
                .collect(Collectors.groupingBy(RepositoryEntity::getMainLanguage, Collectors.counting()));

        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> CvSkillDTO.builder()
                        .name(e.getKey())
                        .repoCount(e.getValue().intValue())
                        .level(levelFromCount(e.getValue().intValue()))
                        .build())
                .collect(Collectors.toList());
    }

    private String levelFromCount(int count) {
        if (count >= 3) return "Avanzado";
        if (count == 2) return "Intermedio";
        return "Básico";
    }
    public byte[] exportCvAsPdf(Long userId) {
    CvDTO cv = getCurrentCvForUser(userId);

    String template;
    try {
        template = new String(
                new ClassPathResource("templates/cv-template.html")
                        .getInputStream()
                        .readAllBytes()
        );
    } catch (IOException e) {
        throw new RuntimeException("No se pudo leer la plantilla del CV", e);
    }

    // Construir bloques de skills y proyectos en HTML simple
    String skillsHtml;
    if (cv.getSkills() != null && !cv.getSkills().isEmpty()) {
        skillsHtml = cv.getSkills().stream()
                .map(s -> String.format(
                        "<span class=\"skill-pill\">%s (%s)</span>",
                        escapeHtml(s.getName()),
                        s.getLevel()
                ))
                .collect(Collectors.joining(" "));
    } else {
        skillsHtml = "<span class=\"skill-pill\">Sin skills detectadas aún</span>";
    }

    String projectsHtml;
    if (cv.getProjects() != null && !cv.getProjects().isEmpty()) {
        projectsHtml = cv.getProjects().stream()
                .map(p -> String.format(
                        "<div><strong>%s</strong> — %s<br/><small>%s</small></div>",
                        escapeHtml(p.getName()),
                        escapeHtml(Optional.ofNullable(p.getMainTech()).orElse("")),
                        escapeHtml(Optional.ofNullable(p.getDescription()).orElse(""))
                ))
                .collect(Collectors.joining("<br/>"));
    } else {
        projectsHtml = "<div>No hay proyectos destacados aún.</div>";
    }

    String html = template
            .replace("{{fullName}}", escapeHtml(
                    Optional.ofNullable(cv.getFullName()).orElse("Tu nombre")))
            .replace("{{headline}}", escapeHtml(
                    Optional.ofNullable(cv.getHeadline()).orElse("")))
            .replace("{{location}}", escapeHtml(
                    Optional.ofNullable(cv.getLocation()).orElse("")))
            .replace("{{summary}}", escapeHtml(
                    Optional.ofNullable(cv.getSummary()).orElse("")))
            .replace("{{skills}}", skillsHtml)
            .replace("{{projects}}", projectsHtml);

    try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.useFastMode();
        builder.withHtmlContent(html, null);
        builder.toStream(out);
        builder.run();
        return out.toByteArray();
    } catch (Exception e) {
        throw new RuntimeException("No se pudo generar el PDF del CV", e);
    }
}

private String escapeHtml(String input) {
    if (input == null) return "";
    return input
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;");
}

    private List<CvProjectDTO> buildProjects(List<RepositoryEntity> repos) {
        return repos.stream()
                .filter(r -> Boolean.FALSE.equals(r.getIsPrivate()))
                .limit(5)
                .map(r -> CvProjectDTO.builder()
                        .name(r.getName())
                        .description(r.getDescription())
                        .url(r.getUrl())
                        .mainTech(r.getMainLanguage())
                        .build())
                .collect(Collectors.toList());
    }

    private String buildHeadline(User user, List<CvSkillDTO> skills) {
        String role = (user.getRole() != null && !user.getRole().isBlank())
                ? user.getRole()
                : "Backend Developer";

        String topSkills = skills.stream()
                .limit(3)
                .map(CvSkillDTO::getName)
                .collect(Collectors.joining(" · "));

        return topSkills.isBlank() ? role : role + " · " + topSkills;
    }

    private String buildSummary(User user, List<CvSkillDTO> skills) {
        if (user.getBio() != null && !user.getBio().isBlank()) {
            return user.getBio();
        }

        String name = user.getName() != null ? user.getName() : user.getUsername();
        String topSkills = skills.stream()
                .limit(3)
                .map(CvSkillDTO::getName)
                .collect(Collectors.joining(", "));

        if (topSkills.isBlank()) {
            return "Desarrollador de software con experiencia en backend y desarrollo de aplicaciones web.";
        }

        return "Desarrollador con experiencia en " + topSkills
                + ", enfocado en construir APIs limpias y aplicaciones escalables. "
                + "Apasionado por el código bien hecho y los proyectos con impacto real.";
    }

    private int calculateScore(User user, List<RepositoryEntity> repos, List<CvSkillDTO> skills) {
        int score = 40; // base

        long publicRepos = repos.stream().filter(r -> Boolean.FALSE.equals(r.getIsPrivate())).count();
        score += Math.min(20, (int) publicRepos * 4);   // hasta 20 pts por repos públicos

        score += Math.min(20, skills.size() * 4);       // hasta 20 pts por lenguajes detectados

        if (user.getBio() != null && !user.getBio().isBlank()) score += 10; // tiene bio
        if (user.getLocation() != null && !user.getLocation().isBlank()) score += 5;
        if (user.getName() != null && !user.getName().isBlank()) score += 5;

        return Math.min(100, score);
    }
}