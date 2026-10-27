package portfolioLucasBackend.Lucas.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import portfolioLucasBackend.Lucas.dto.response.FileUploadResponseDto;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private Path rootLocation;

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "webp", "svg", "mp4", "webm", "mov"
    );

    @PostConstruct
    public void init() {
        try {
            this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(this.rootLocation);
            log.info("Directorio de almacenamiento de archivos inicializado en: {}", this.rootLocation);
        } catch (IOException e) {
            log.error("No se pudo inicializar la carpeta de subidas: {}", e.getMessage());
            throw new RuntimeException("No se pudo inicializar el almacenamiento de archivos", e);
        }
    }

    public FileUploadResponseDto storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No se puede subir un archivo vacío");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        if (originalFilename.contains("..")) {
            throw new IllegalArgumentException("El nombre del archivo contiene una ruta no válida: " + originalFilename);
        }

        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Extensión de archivo no permitida: " + extension +
                    ". Extensiones admitidas: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        String uniqueFileName = UUID.randomUUID() + (extension.isEmpty() ? "" : "." + extension);

        try {
            Path destinationFile = this.rootLocation.resolve(uniqueFileName).normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(this.rootLocation)) {
                throw new SecurityException("No se puede guardar un archivo fuera del directorio configurado");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            String publicUrl = "/uploads/" + uniqueFileName;
            log.info("Archivo subido exitosamente: {} -> {}", originalFilename, publicUrl);

            return FileUploadResponseDto.builder()
                    .url(publicUrl)
                    .filename(uniqueFileName)
                    .contentType(file.getContentType())
                    .sizeBytes(file.getSize())
                    .build();

        } catch (IOException e) {
            log.error("Error al almacenar el archivo {}: {}", originalFilename, e.getMessage());
            throw new RuntimeException("Error al almacenar el archivo: " + originalFilename, e);
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex + 1);
        }
        return "";
    }
}
