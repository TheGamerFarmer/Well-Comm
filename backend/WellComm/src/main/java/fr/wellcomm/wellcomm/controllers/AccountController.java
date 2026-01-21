package fr.wellcomm.wellcomm.controllers;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.RecordService;
import fr.wellcomm.wellcomm.services.RecordAccountService;
import fr.wellcomm.wellcomm.services.SessionService;
import fr.wellcomm.wellcomm.domain.Role;
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
        private String userName;
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
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
        }

    @Getter
    @Setter
    public static class UpdateProfileRequest {
        private String userName;
        private String firstName;
        private String lastName;
        }

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

        if (!passwordEncoder.matches(request.getCurrentPassword(), account.getPassword())) {
            return ResponseEntity.status(403).body("Mot de passe actuel incorrect");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);

        return ResponseEntity.ok().build();
    }


    @PostMapping("/changeUserInfos")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody UpdateProfileRequest request
    ) {
        Account account = accountRepository
                        .findById(userId)
                        .orElseThrow();

        if (!account.getUserName().equals(request.getUserName())) {

            if (accountRepository.existsByUserName(request.userName)) {
                return ResponseEntity.status(409).body("Account already exists");
            }
            account.setUserName(request.getUserName());
        }

        account.setFirstName(request.getFirstName());
        account.setLastName(request.getLastName());

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

    @PostMapping("/addAccess")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> addRecordAccount(@PathVariable Long userId, @RequestBody addRecordAccountRequest request) {
        Account account = accountService.getUser(userId);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        Record record = recordService.getRecord(request.getRecordId());
        if (record == null)
            return ResponseEntity.badRequest().body("Record not found");

        RecordAccount newAccess = new RecordAccount(account, record, Role.valueOf(request.getTitle()));

        accountService.addRecordAccount(account, newAccess);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/addAccess/current_record/{name}")
    @PreAuthorize("#userId.toString() == authentication.name")
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

        RecordAccount newAccess = new RecordAccount(account, record, Role.valueOf(request.getTitle()));

        accountService.addRecordAccount(account, newAccess);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteAccess/")
    @PreAuthorize("#userId.toString() == authentication.name")
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

    @DeleteMapping("/deleteAccess/current_record/{targetUserName}/{recordId}")
    @PreAuthorize("#userId.toString() == authentication.name")
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


    @PutMapping("/updateRoleAccess/current_record/{targetUserName}/{recordId}/{title}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> updateRoleRecordAccount(
            @PathVariable @SuppressWarnings("unused") Long userId,
            @PathVariable String targetUserName,
            @PathVariable Long recordId,
            @PathVariable String title
    ) {
        Account account = accountService.getUserByUserName(targetUserName);
        if (account == null)
            return ResponseEntity.badRequest().body("Nom d'utilisateur inexistant");
        Role role;
        if(title.equals("Aidant")) {
            role = Role.AIDANT;
        }
        else {
            role = Role.EMPLOYEE;
        }

        recordAccountService.updateRoleRecordAccount(targetUserName, recordId, role);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/logout")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> logout(@PathVariable Long userId) {
        Account account = accountRepository.findById(userId).orElse(null);
        if (account == null)
            return ResponseEntity.badRequest().body("Account not found");

        sessionService.logout(account);
        return ResponseEntity.ok().build();
    }

}
