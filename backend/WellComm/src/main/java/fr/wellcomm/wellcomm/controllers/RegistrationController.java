package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class RegistrationController {
    private final AccountRepository accountRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Getter
    @Setter
    public static class RegisterRequest {
        private String userName;
        private String password;
        private String firstName;
        private String lastName;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (accountRepository.existsById(request.getUserName())) {
            return ResponseEntity.status(409).body("Account already exists");
        }

        accountRepository.save(new Account(request.getUserName(),
                request.getFirstName(),
                request.getLastName(),
                passwordEncoder.encode(request.getPassword())));

        return ResponseEntity.status(201).build();
    }
}