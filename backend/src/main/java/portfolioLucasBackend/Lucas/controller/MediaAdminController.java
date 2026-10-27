package portfolioLucasBackend.Lucas.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import portfolioLucasBackend.Lucas.dto.response.FileUploadResponseDto;
import portfolioLucasBackend.Lucas.service.FileStorageService;

@RestController
@RequestMapping("/api/v1/admin/media")
@RequiredArgsConstructor
public class MediaAdminController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileUploadResponseDto> uploadFile(@RequestParam("file") MultipartFile file) {
        FileUploadResponseDto response = fileStorageService.storeFile(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
