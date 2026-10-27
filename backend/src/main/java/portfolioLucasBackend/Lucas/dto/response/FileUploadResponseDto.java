package portfolioLucasBackend.Lucas.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileUploadResponseDto {

    private String url;
    private String filename;
    private String contentType;
    private long sizeBytes;
}
