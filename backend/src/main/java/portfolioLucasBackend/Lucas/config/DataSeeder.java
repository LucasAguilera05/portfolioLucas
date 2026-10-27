package portfolioLucasBackend.Lucas.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import portfolioLucasBackend.Lucas.model.Project;
import portfolioLucasBackend.Lucas.model.ProjectCategory;
import portfolioLucasBackend.Lucas.repository.ProjectRepository;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProjectRepository projectRepository;

    @Override
    public void run(String... args) {
        if (projectRepository.count() == 0) {
            log.info("Base de datos de proyectos vacía. Ejecutando DataSeeder con proyectos de ejemplo...");

            Project clinicOps = Project.builder()
                    .title("ClinicOps — Gestión de Turnos y Pacientes")
                    .shortDescription("Sistema SaaS multi-sede para clínicas que gestiona turnos en tiempo real, historias clínicas y facturación con control de acceso por roles.")
                    .problemSolved("Las clínicas gestionaban turnos en planillas y mensajería manual: doble reserva frecuente, ausentismo del 28% y nula trazabilidad de historias clínicas entre sedes.")
                    .architectureDetails("""
                            Arquitectura desacoplada y escalable:
                            - Frontend: SPA desarrollada en React y TypeScript, gestionando caché y sincronización asíncrona mediante React Query. Formularios estrictamente tipados.
                            - Backend: API RESTful en Spring Boot 3 con Java 21, aplicando principios de Clean Architecture y seguridad stateless con Spring Security + JWT (@PreAuthorize por roles).
                            - Base de Datos: PostgreSQL 16 con esquema relacional normalizado, índices optimizados y restricciones para prevenir colisiones de turnos concurrentes.
                            - Infraestructura: Contenedores Docker, CI/CD automatizado y configuración lista para despliegue en entornos cloud.
                            """)
                    .category(ProjectCategory.WORK)
                    .featured(true)
                    .technologies(List.of("React", "TypeScript", "Spring Boot", "Java 21", "PostgreSQL", "Docker", "JWT", "Tailwind CSS"))
                    .thumbnailUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80")
                    .images(List.of(
                            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1200&auto=format&fit=crop&q=80"
                    ))
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .liveSystemUrl("https://clinicops-demo.example.com")
                    .demoEnvironmentUrl("https://clinicops-demo.example.com/tour")
                    .githubUrl("https://github.com/tu-usuario/clinic-ops")
                    .build();

            Project payFlow = Project.builder()
                    .title("PayFlow API — Motor de Conciliación Bancaria")
                    .shortDescription("API REST idempotente y de alto rendimiento que procesa y concilia transacciones financieras masivas con colas asíncronas y auditoría end-to-end.")
                    .problemSolved("El sector financiero conciliaba extractos bancarios manualmente en planillas de cálculo, demorando más de 72 horas por cierre contable y generando inconsistencias por registros duplicados.")
                    .architectureDetails("""
                            Arquitectura orientada a eventos e idempotencia:
                            - Frontend: Panel interactivo en React + Tailwind CSS con virtualización de grillas para soportar visualización fluida de más de 100k transacciones.
                            - Backend: API en Spring Boot 3 con soporte de procesamiento concurrente, transaccionalidad declarativa y claves de idempotencia en Redis.
                            - Base de Datos: PostgreSQL particionado por rangos de fecha con índices B-Tree compuestos para optimizar matching de pagos.
                            - Mensajería & Cache: RabbitMQ para desacoplamiento y reintentos automáticos, y Redis para control de concurrencia y caché de estados.
                            """)
                    .category(ProjectCategory.WORK)
                    .featured(true)
                    .technologies(List.of("Java 21", "Spring Boot", "PostgreSQL", "RabbitMQ", "Redis", "Docker", "Spring Data JPA"))
                    .thumbnailUrl("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80")
                    .images(List.of(
                            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80"
                    ))
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .liveSystemUrl("https://payflow-api.example.com")
                    .demoEnvironmentUrl("https://payflow-api.example.com/swagger-ui.html")
                    .githubUrl("https://github.com/tu-usuario/payflow-api")
                    .build();

            projectRepository.saveAll(List.of(clinicOps, payFlow));
            log.info("DataSeeder ejecutado con éxito: 2 proyectos iniciales guardados en la base de datos.");
        } else {
            log.info("DataSeeder omitido: la base de datos ya contiene {} proyectos.", projectRepository.count());
        }
    }
}
