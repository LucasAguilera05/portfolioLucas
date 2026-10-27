package portfolioLucasBackend.Lucas.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import portfolioLucasBackend.Lucas.dto.request.ProjectRequestDto;
import portfolioLucasBackend.Lucas.dto.response.ProjectResponseDto;
import portfolioLucasBackend.Lucas.service.ProjectService;

@RestController
@RequestMapping("/api/v1/admin/projects")
@RequiredArgsConstructor
public class ProjectAdminController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponseDto> createProject(@Valid @RequestBody ProjectRequestDto request) {
        ProjectResponseDto created = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponseDto> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequestDto request
    ) {
        ProjectResponseDto updated = projectService.updateProject(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
