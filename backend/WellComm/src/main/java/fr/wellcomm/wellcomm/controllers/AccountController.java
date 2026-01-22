package fr.wellcomm.wellcomm.controllers;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/{userId}")
@AllArgsConstructor
public class AccountController {
    public final AccountService accountService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AccountRepository accountRepository;
    private final SessionService sessionService;
    public record UserInfos(String userName, String firstName, String lastName) {}
    public record ChangePasswordRequest(String currentPassword, String newPassword) {}

    @GetMapping("/infos")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> getInfos(@PathVariable Long userId) {
        Account account = accountService.getUser(userId);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        return ResponseEntity.ok(new UserInfos(account.getUserName(),account.getFirstName(),
                account.getLastName()));
    }

    @PostMapping("/changePassword")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordRequest request
    ) {
        Account account = accountService.getUser(userId);
        if (account == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!passwordEncoder.matches(request.currentPassword, account.getPassword())) {
            return ResponseEntity.status(403).body("Mot de passe actuel incorrect");
        }

        account.setPassword(passwordEncoder.encode(request.newPassword));
        accountRepository.save(account);

        return ResponseEntity.ok().build();
    }


    @PostMapping("/changeUserInfos")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody UserInfos request
    ) {
        Account account = accountRepository
                        .findById(userId)
                        .orElseThrow();

        if (!account.getUserName().equals(request.userName)) {

            if (accountRepository.existsByUserName(request.userName)) {
                return ResponseEntity.status(409).body("Account already exists");
            }
            account.setUserName(request.userName);
        }

        account.setFirstName(request.firstName);
        account.setLastName(request.lastName);

        accountService.saveUser(account);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteUser")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        Account account = accountService.getUser(userId);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        accountService.deleteUser(account);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> logout(@PathVariable long userId) {
        Account account = accountRepository.findById(userId).orElse(null);
        if (account == null)
            return ResponseEntity.badRequest().body("Account not found");

        sessionService.logout(account);
        return ResponseEntity.ok().build();
    }

}
