package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.dto.UserProfileResponse;
import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;


@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class UserController {

    private final AccountRepository accountRepository;

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
}
