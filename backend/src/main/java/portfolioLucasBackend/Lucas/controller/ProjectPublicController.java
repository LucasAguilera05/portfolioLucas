package portfolioLucasBackend.Lucas.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import portfolioLucasBackend.Lucas.dto.response.ProjectResponseDto;
import portfolioLucasBackend.Lucas.model.ProjectCategory;
import portfolioLucasBackend.Lucas.service.ProjectService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectPublicController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponseDto>> getAllProjects(
            @RequestParam(required = false) ProjectCategory category
    ) {
        List<ProjectResponseDto> projects = projectService.getAllProjects(category);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponseDto> getProjectById(@PathVariable Long id) {
        ProjectResponseDto project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }
}
