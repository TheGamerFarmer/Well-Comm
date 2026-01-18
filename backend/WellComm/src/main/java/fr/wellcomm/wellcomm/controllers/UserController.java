package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.dto.UserProfileResponse;
import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import lombok.Getter;
import lombok.Setter;

import java.security.Principal;


@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class UserController {

    private final AccountRepository accountRepository;
    private final BCryptPasswordEncoder passwordEncoder;


    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Account account = accountRepository
                .findById(principal.getName())
                .orElseThrow();

        return ResponseEntity.ok(
                new UserProfileResponse(
                        account.getUserName(),
                        account.getFirstName(),
                        account.getLastName()
                )
        );
    }

    @Getter
    @Setter
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }

@PostMapping("/changePassword")
public ResponseEntity<?> changePassword(
        @RequestBody ChangePasswordRequest request,
        Principal principal
) {
    if (principal == null) {
        return ResponseEntity.status(401).body("Utilisateur non connecté");
    }

    Account account = accountRepository
            .findById(principal.getName())
            .orElseThrow();

    if (!passwordEncoder.matches(request.getCurrentPassword(), account.getPassword())) {
        return ResponseEntity.status(403).body("Mot de passe actuel incorrect");
    }

    account.setPassword(passwordEncoder.encode(request.getNewPassword()));
    accountRepository.save(account);

    return ResponseEntity.ok().build();
}





}
