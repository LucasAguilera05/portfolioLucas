package portfolioLucasBackend.Lucas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import portfolioLucasBackend.Lucas.model.Project;
import portfolioLucasBackend.Lucas.model.ProjectCategory;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByOrderByFeaturedDescCreatedAtDesc();

    List<Project> findByCategoryOrderByFeaturedDescCreatedAtDesc(ProjectCategory category);
}
