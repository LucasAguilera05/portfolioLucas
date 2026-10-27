package portfolioLucasBackend.Lucas.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import portfolioLucasBackend.Lucas.dto.request.ProjectRequestDto;
import portfolioLucasBackend.Lucas.dto.response.ProjectResponseDto;
import portfolioLucasBackend.Lucas.exception.ResourceNotFoundException;
import portfolioLucasBackend.Lucas.model.Project;
import portfolioLucasBackend.Lucas.model.ProjectCategory;
import portfolioLucasBackend.Lucas.repository.ProjectRepository;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public List<ProjectResponseDto> getAllProjects(ProjectCategory category) {
        List<Project> projects;
        if (category != null) {
            projects = projectRepository.findByCategoryOrderByFeaturedDescCreatedAtDesc(category);
        } else {
            projects = projectRepository.findAllByOrderByFeaturedDescCreatedAtDesc();
        }

        return projects.stream()
                .map(ProjectResponseDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponseDto getProjectById(Long id) {
        Project project = findProjectOrThrow(id);
        return ProjectResponseDto.fromEntity(project);
    }

    @Transactional
    public ProjectResponseDto createProject(ProjectRequestDto dto) {
        Project project = Project.builder()
                .title(dto.getTitle().trim())
                .shortDescription(dto.getShortDescription().trim())
                .problemSolved(dto.getProblemSolved())
                .architectureDetails(dto.getArchitectureDetails())
                .category(dto.getCategory())
                .featured(dto.getFeatured() != null ? dto.getFeatured() : false)
                .technologies(dto.getTechnologies() != null ? new ArrayList<>(dto.getTechnologies()) : new ArrayList<>())
                .thumbnailUrl(dto.getThumbnailUrl())
                .images(dto.getImages() != null ? new ArrayList<>(dto.getImages()) : new ArrayList<>())
                .videoUrl(dto.getVideoUrl())
                .liveSystemUrl(dto.getLiveSystemUrl())
                .demoEnvironmentUrl(dto.getDemoEnvironmentUrl())
                .githubUrl(dto.getGithubUrl())
                .build();

        Project saved = projectRepository.save(project);
        log.info("Nuevo proyecto creado con éxito. ID: {}, Título: {}", saved.getId(), saved.getTitle());
        return ProjectResponseDto.fromEntity(saved);
    }

    @Transactional
    public ProjectResponseDto updateProject(Long id, ProjectRequestDto dto) {
        Project project = findProjectOrThrow(id);

        project.setTitle(dto.getTitle().trim());
        project.setShortDescription(dto.getShortDescription().trim());
        project.setProblemSolved(dto.getProblemSolved());
        project.setArchitectureDetails(dto.getArchitectureDetails());
        project.setCategory(dto.getCategory());
        if (dto.getFeatured() != null) {
            project.setFeatured(dto.getFeatured());
        }
        if (dto.getTechnologies() != null) {
            project.setTechnologies(new ArrayList<>(dto.getTechnologies()));
        }
        project.setThumbnailUrl(dto.getThumbnailUrl());
        if (dto.getImages() != null) {
            project.setImages(new ArrayList<>(dto.getImages()));
        }
        project.setVideoUrl(dto.getVideoUrl());
        project.setLiveSystemUrl(dto.getLiveSystemUrl());
        project.setDemoEnvironmentUrl(dto.getDemoEnvironmentUrl());
        project.setGithubUrl(dto.getGithubUrl());

        Project updated = projectRepository.save(project);
        log.info("Proyecto ID: {} actualizado exitosamente", updated.getId());
        return ProjectResponseDto.fromEntity(updated);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = findProjectOrThrow(id);
        projectRepository.delete(project);
        log.info("Proyecto ID: {} eliminado exitosamente", id);
    }

    private Project findProjectOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado con el id: " + id));
    }
}
