package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Session;
import fr.wellcomm.wellcomm.entities.Utilisateur;
import fr.wellcomm.wellcomm.repositories.SessionRepository;
import fr.wellcomm.wellcomm.repositories.UtilisateurRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class LoginController {
    private final UtilisateurRepository userRepository;
    private final SessionRepository sessionRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String userName = credentials.get("userName");
        String password = credentials.get("password");

        Utilisateur user = userRepository.findByuserName(userName);

        if (user == null) {
            return ResponseEntity.status(401).body("Utilisateur ou mot de passe incorrect");
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            String token = UUID.randomUUID().toString();

            Session session = new Session();
            session.setToken(token);
            session.setUserName(user.getUserName());
            session.setDateExpiration(LocalDateTime.now().plusHours(24));

            sessionRepository.save(session);

            return ResponseEntity.ok(Map.of("token", token));
        }

        return ResponseEntity.status(401).body("Utilisateur ou mot de passe incorrect");
    }
}