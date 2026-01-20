package fr.wellcomm.wellcomm.controllers;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.RecordService;
import fr.wellcomm.wellcomm.services.RecordAccountService;
import fr.wellcomm.wellcomm.services.SessionService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;


@RestController
@RequestMapping("/api/{userId}")
@AllArgsConstructor
public class AccountController {
    public final AccountService accountService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RecordService recordService;
    private final AccountRepository accountRepository;
    private final RecordAccountService recordAccountService;
    private final SessionService sessionService;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class UserInfos {
        private String firstName;
        private String lastName;
    }

    @Getter
    @Setter
    public static class addRecordAccountRequest {
        private long recordId;
        private String title;
    }

    @Getter
    @Setter
    public static class deleteRecordAccountRequest {
        private long recordId;
    }

    @Getter
    @Setter
    public static class LogoutRequest {
        private String userName;
    }

        @Getter
        @Setter
        public static class ChangePasswordRequest {
            private String currentPassword;
            private String newPassword;
        }

    @GetMapping("/infos")
    @PreAuthorize("#userId == authentication.name")
    public ResponseEntity<?> getInfos(@PathVariable Long userId) {
        Account account = accountService.getUser(userId);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        return ResponseEntity.ok(new UserInfos(account.getFirstName(),
                account.getLastName()));
    }

    @GetMapping("/changePassword/{oldPassword}/{newPassword}")
    @PreAuthorize("#userId == authentication.name")
    public ResponseEntity<?> checkPassword(@PathVariable Long userId, @PathVariable String oldPassword, @PathVariable String newPassword) {
        Account account = accountService.getUser(userId);
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

    @PostMapping("/changePassword")
    @PreAuthorize("#userId == authentication.name")
    public ResponseEntity<?> changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordRequest request
    ) {
        Account account = accountRepository
                .findById(userId)
                .orElseThrow();

        if (!passwordEncoder.matches(request.getCurrentPassword(), account.getPassword())) {
            return ResponseEntity.status(403).body("Mot de passe actuel incorrect");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);

        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/deleteUser")
    @PreAuthorize("#userId == authentication.name")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        Account account = accountService.getUser(userId);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        accountService.deleteUser(account);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/addAccess")
    @PreAuthorize("#userId == authentication.name")
    public ResponseEntity<?> addRecordAccount(@PathVariable Long userId, @RequestBody addRecordAccountRequest request) {
        Account account = accountService.getUser(userId);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        Record record = recordService.getRecord(request.getRecordId());
        if (record == null)
            return ResponseEntity.badRequest().body("Record not found");

        RecordAccount newAccess = new RecordAccount();
        newAccess.setRecord(record);
        newAccess.setTitle(request.getTitle());

        accountService.addRecordAccount(account, newAccess);

        return ResponseEntity.ok().build();
    }

//ajouter un assistant autre que la personne connecté à un dossier
    @PostMapping("/addAccess/current_record/{name}")
    @PreAuthorize("#userId == authentication.name")
    public ResponseEntity<?> addRecordAccountCurrentRecord(@PathVariable @SuppressWarnings("unused") Long userId,
                                                           @RequestBody addRecordAccountRequest request,
                                                           @PathVariable String name) {
        Account account = accountService.getUserByUserName(name);
        if (account == null)
            return ResponseEntity.badRequest().body("Nom d'utilisateur inexistant");

        Record record = recordService.getRecord(request.getRecordId());
        if (record == null)
            return ResponseEntity.badRequest().body("Dossier inexistant");

        Optional<RecordAccount> existing = recordAccountService.getByRecordId(request.getRecordId()).stream()
            .filter(ra -> ra.getAccount().getUserName().equals(name))
            .findFirst();
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Cette personne à déjà été ajoutée");
        }

        RecordAccount newAccess = new RecordAccount();
        newAccess.setRecord(record);
        newAccess.setTitle(request.getTitle());

        accountService.addRecordAccount(account, newAccess);

        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/deleteAccess/")
    @PreAuthorize("#userId == authentication.name")
    public ResponseEntity<?> deleteRecordAccount(@PathVariable Long userId, @RequestBody deleteRecordAccountRequest request) {
        Account account = accountService.getUser(userId);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        RecordAccount recordAccount = account.getRecordAccounts().get(request.getRecordId());
        if (recordAccount == null)
            return ResponseEntity.badRequest().body("Access not found");

        accountService.deleteRecordAccount(account, recordAccount);

        return ResponseEntity.ok().build();
    }

    //retirer un assistant autre que la personne connecté
    @DeleteMapping("/deleteAccess/current_record/{targetUserName}/{recordId}")
    @PreAuthorize("#userId == authentication.name")
    public ResponseEntity<?> deleteRecordAccount(
            @PathVariable Long userId,
            @PathVariable String targetUserName,
            @PathVariable Long recordId
    ) {
        Account account = accountService.getUser(userId);
                if (account == null)
                    return ResponseEntity.badRequest().body("Nom d'utilisateur inexistant");

        Account targetAccount = accountService.getUserByUserName(targetUserName);
            if (targetAccount == null) {
                return ResponseEntity.badRequest().body("Assistant introuvable");
            }

         RecordAccount recordAccount = targetAccount.getRecordAccounts().values()
                    .stream()
                    .filter(ra -> ra.getRecord().getId() == recordId)
                    .findFirst()
                    .orElse(null);

            if (recordAccount == null) {
                return ResponseEntity.badRequest().body("Accès introuvable");
            }

            accountService.deleteRecordAccount(targetAccount, recordAccount);

            return ResponseEntity.ok().build();
    }

    //modifier le role d'un assistant autre que la personne connecté
    @PutMapping("/updateRoleAccess/current_record/{targetUserName}/{recordId}/{role}")
    @PreAuthorize("#userId == authentication.name")
    public ResponseEntity<?> updateRoleRecordAccount(
            @PathVariable Long userId,
            @PathVariable String targetUserName,
            @PathVariable Long recordId,
            @PathVariable String role
    ) {
        Account account = accountService.getUserByUserName(targetUserName);
                if (account == null)
                    return ResponseEntity.badRequest().body("Nom d'utilisateur inexistant");

        recordAccountService.updateRoleRecordAccount(targetUserName, recordId, role);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/logout")
    @PreAuthorize("#userId == authentication.name")
    public ResponseEntity<?> logout(@PathVariable Long userId,LogoutRequest logoutRequest, HttpServletRequest request) {

        Account account = accountRepository.findById(userId).orElse(null);
        if (account == null)
            return ResponseEntity.badRequest().body("Account not found");

        sessionService.logout(account);
        return ResponseEntity.ok().build();
    }

}
