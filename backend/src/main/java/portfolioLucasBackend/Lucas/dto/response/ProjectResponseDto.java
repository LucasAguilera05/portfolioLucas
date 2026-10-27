package portfolioLucasBackend.Lucas.dto.response;

import lombok.*;
import portfolioLucasBackend.Lucas.model.Project;
import portfolioLucasBackend.Lucas.model.ProjectCategory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponseDto {

    private Long id;
    private String title;
    private String shortDescription;
    private String problemSolved;
    private String architectureDetails;
    private ProjectCategory category;
    private Boolean featured;
    private List<String> technologies;
    private String thumbnailUrl;
    private List<String> images;
    private String videoUrl;
    private String liveSystemUrl;
    private String demoEnvironmentUrl;
    private String githubUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProjectResponseDto fromEntity(Project project) {
        if (project == null) return null;
        return ProjectResponseDto.builder()
                .id(project.getId())
                .title(project.getTitle())
                .shortDescription(project.getShortDescription())
                .problemSolved(project.getProblemSolved())
                .architectureDetails(project.getArchitectureDetails())
                .category(project.getCategory())
                .featured(project.getFeatured())
                .technologies(project.getTechnologies() != null ? new ArrayList<>(project.getTechnologies()) : List.of())
                .thumbnailUrl(project.getThumbnailUrl())
                .images(project.getImages() != null ? new ArrayList<>(project.getImages()) : List.of())
                .videoUrl(project.getVideoUrl())
                .liveSystemUrl(project.getLiveSystemUrl())
                .demoEnvironmentUrl(project.getDemoEnvironmentUrl())
                .githubUrl(project.getGithubUrl())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
