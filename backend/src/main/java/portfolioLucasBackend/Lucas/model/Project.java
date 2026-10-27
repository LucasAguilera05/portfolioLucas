package portfolioLucasBackend.Lucas.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "short_description", nullable = false, length = 300)
    private String shortDescription;

    @Column(name = "problem_solved", columnDefinition = "TEXT")
    private String problemSolved;

    @Column(name = "architecture_details", columnDefinition = "TEXT")
    private String architectureDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProjectCategory category;

    @Builder.Default
    @Column(nullable = false)
    private Boolean featured = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_technologies", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "technology", nullable = false)
    @Builder.Default
    private List<String> technologies = new ArrayList<>();

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_images", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "image_url", nullable = false, length = 500)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(name = "live_system_url", length = 500)
    private String liveSystemUrl;

    @Column(name = "demo_environment_url", length = 500)
    private String demoEnvironmentUrl;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
