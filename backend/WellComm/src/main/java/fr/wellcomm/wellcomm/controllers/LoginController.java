package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Session;
import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.repositories.SessionRepository;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.services.AccountService;
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
    private final AccountService accountService;

    @Getter
    @Setter
    public static class LoginRequest {
        private String userName;
        private String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        String userName = loginRequest.getUserName();
        String password = loginRequest.getPassword();

        Account account = accountRepository.findByUserName(userName).orElse(null);

        if (account == null)
            return ResponseEntity.status(401).body("Utilisateur ou mot de passe incorrect");

        if (accountService.isAccountLocked(account)) {
            return ResponseEntity.status(403).body("Nombre de tentatives dépassé.\n" +
                    "Votre compte est temporairement bloqué afin de protéger vos données.");
        }

        if (passwordEncoder.matches(password, account.getPassword())) {
            accountService.resetFailedAttempts(account);

            String token = UUID.randomUUID().toString();

            sessionRepository.save(new Session(token,
                    account,
                    LocalDateTime.now().plusHours(24)));

            ResponseCookie cookie = ResponseCookie.from("token", token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(86400)
                    .sameSite("Strict")
                    .build();

            Map<String, Object> responseBody = Map.of(
                    "id", account.getId(),
                    "userName", account.getUserName()
            );

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(responseBody);
        } else {
            accountService.registerFailedAttempt(account);
            return ResponseEntity.status(401).body("Nom d'utilisateur ou mot de passe incorrect");
        }
    }

    @GetMapping("/isLogin")
    public boolean testLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }
}