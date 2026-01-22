package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class RegistrationController {
    private final AccountRepository accountRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    public record RegisterRequest(String userName, String password, String firstName, String lastName) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (accountRepository.existsByUserName(request.userName)) {
            return ResponseEntity.status(409).body("Account already exists");
        }

        Account savedAccount = accountRepository.save(new Account(
                request.userName,
                request.firstName,
                request.lastName,
                passwordEncoder.encode(request.password)
        ));

        Map<String, Object> responseBody = Map.of(
                "id", savedAccount.getId(),
                "userName", savedAccount.getUserName()
        );

        return ResponseEntity.status(201).body(responseBody);
    }
}