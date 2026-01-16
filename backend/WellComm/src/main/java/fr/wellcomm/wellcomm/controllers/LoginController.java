package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Session;
import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.repositories.SessionRepository;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class LoginController {
    private final AccountRepository accountRepository;
    private final SessionRepository sessionRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Getter
    @Setter
    public static class LoginRequest {
        private String userName;
        private String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        System.out.println(request.getQueryString());
        String userName = loginRequest.getUserName();
        String password = loginRequest.getPassword();

        Account account = accountRepository.findById(userName).orElse(null);

        if (account == null) {
            return ResponseEntity.status(401).body("Utilisateur ou mot de passe incorrect");
        }

        if (passwordEncoder.matches(password, account.getPassword())) {
            String token = UUID.randomUUID().toString();

            sessionRepository.save(new Session(token,
                    account,
                    LocalDateTime.now().plusHours(24),
                    null));

            ResponseCookie cookie = ResponseCookie.from("token", token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(86400)
                    .sameSite("Strict")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .build();
        } else
            return ResponseEntity.status(401).body("Utilisateur ou mot de passe incorrect");
    }

    @GetMapping("/isLogin")
    public boolean testLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication);

        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Utilisateur non connecté");
        }

        return ResponseEntity.ok(Map.of("userName", principal.getName()));
    }
}