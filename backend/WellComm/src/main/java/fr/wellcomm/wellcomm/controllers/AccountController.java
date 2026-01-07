package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.services.AccountService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/{userName}")
@AllArgsConstructor
public class AccountController {
    public final AccountService accountService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class UserInfos {
        private String firstName;
        private String lastName;
    }

    @GetMapping("/infos")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> getInfos(@PathVariable String userName) {
        Account account = accountService.getUser(userName);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        return ResponseEntity.ok(new UserInfos(account.getFirstName(),
                account.getLastName()));
    }

    @GetMapping("/changePassword/{oldPassword}/{newPassword}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> checkPassword(@PathVariable String userName, @PathVariable String oldPassword, @PathVariable String newPassword) {
        Account account = accountService.getUser(userName);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        if (passwordEncoder.matches(oldPassword, account.getPassword())) {
            account.setPassword(passwordEncoder.encode(newPassword));

            accountService.saveUser(account);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).body("Mot de passe incorrect");
        }
    }

    @GetMapping("/deleteUser")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> deleteUser(@PathVariable String userName) {
        Account account = accountService.getUser(userName);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        accountService.deleteUser(account);

        return ResponseEntity.ok().build();
    }
}
