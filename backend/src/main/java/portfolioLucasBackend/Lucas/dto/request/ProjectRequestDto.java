package portfolioLucasBackend.Lucas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import portfolioLucasBackend.Lucas.model.ProjectCategory;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRequestDto {

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200, message = "El título no puede superar los 200 caracteres")
    private String title;

    @NotBlank(message = "La descripción corta es obligatoria")
    @Size(max = 300, message = "La descripción corta no puede superar los 300 caracteres")
    private String shortDescription;

    private String problemSolved;

    private String architectureDetails;

    @NotNull(message = "La categoría es obligatoria (WORK, FREELANCE, ACADEMIC, PERSONAL)")
    private ProjectCategory category;

    private Boolean featured;

    private List<String> technologies;

    private String thumbnailUrl;

    private List<String> images;

    private String videoUrl;

    private String liveSystemUrl;

    private String demoEnvironmentUrl;

    private String githubUrl;
}
