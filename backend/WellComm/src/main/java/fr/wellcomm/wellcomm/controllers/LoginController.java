package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Session;
import fr.wellcomm.wellcomm.entities.Utilisateur;
import fr.wellcomm.wellcomm.repositories.SessionRepository;
import fr.wellcomm.wellcomm.repositories.UtilisateurRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class LoginController {
    private final UtilisateurRepository userRepository;
    private final SessionRepository sessionRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Getter
    @Setter
    public static class LoginRequest {
        private String userName;
        private String password;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class LoginResponse {
        private String token;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String userName = loginRequest.getUserName();
        String password = loginRequest.getPassword();

        Utilisateur user = userRepository.findById(userName).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body("Utilisateur ou mot de passe incorrect");
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            String token = UUID.randomUUID().toString();

            sessionRepository.save(new Session(token,
                    user,
                    LocalDateTime.now().plusHours(24)));

            return ResponseEntity.ok(new LoginResponse(token));
        }

        return ResponseEntity.status(401).body("Utilisateur ou mot de passe incorrect");
    }
}