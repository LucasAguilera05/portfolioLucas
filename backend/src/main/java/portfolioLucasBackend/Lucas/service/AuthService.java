package portfolioLucasBackend.Lucas.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import portfolioLucasBackend.Lucas.dto.request.LoginRequestDto;
import portfolioLucasBackend.Lucas.dto.response.AuthResponseDto;
import portfolioLucasBackend.Lucas.security.JwtService;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:Admin123456!}")
    private String adminPassword;

    public AuthResponseDto login(LoginRequestDto request) {
        if (!adminUsername.equals(request.getUsername())) {
            log.warn("Intento de login fallido: usuario desconocido '{}'", request.getUsername());
            throw new BadCredentialsException("Credenciales inválidas");
        }

        boolean passwordMatches = request.getPassword().equals(adminPassword)
                || passwordEncoder.matches(request.getPassword(), adminPassword);

        if (!passwordMatches) {
            log.warn("Intento de login fallido: contraseña incorrecta para usuario '{}'", request.getUsername());
            throw new BadCredentialsException("Credenciales inválidas");
        }

        String token = jwtService.generateToken(adminUsername);

        return AuthResponseDto.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresInMs(jwtService.getExpirationMs())
                .username(adminUsername)
                .build();
    }
}
