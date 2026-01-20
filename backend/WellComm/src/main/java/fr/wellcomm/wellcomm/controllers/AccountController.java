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
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;


@RestController
@RequestMapping("/api/{userName}")
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
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> getInfos(@PathVariable String userName) {
        Account account = accountService.getUser(userName);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        return ResponseEntity.ok(new UserInfos(account.getFirstName(),
                account.getLastName()));
    }

@PostMapping("/changePassword")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> changePassword(
            @PathVariable String userName,
            @RequestBody ChangePasswordRequest request
    ) {
        Account account = accountRepository
                .findById(userName)
                .orElseThrow();

        if (!passwordEncoder.matches(request.getCurrentPassword(), account.getPassword())) {
            return ResponseEntity.status(403).body("Mot de passe actuel incorrect");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);

        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/deleteUser")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> deleteUser(@PathVariable String userName) {
        Account account = accountService.getUser(userName);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        accountService.deleteUser(account);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/addAccess")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> addRecordAccount(@PathVariable String userName, @RequestBody addRecordAccountRequest request) {
        Account account = accountService.getUser(userName);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        Record record = recordService.getRecord(request.getRecordId());
        if (record == null)
            return ResponseEntity.badRequest().body("Record not found");

        RecordAccount newAccess = new RecordAccount();
        newAccess.setRecord(record);
        if(request.getTitle().equals("Aidant")) {
            newAccess.setTitle(Role.AIDANT);
        }
        else if(request.getTitle().equals("Employé")) {
            newAccess.setTitle(Role.EMPLOYEE);
        }
        else{
            newAccess.setTitle(Role.MEDECIN);
        }

        accountService.addRecordAccount(account, newAccess);

        return ResponseEntity.ok().build();
    }

//ajouter un assistant autre que la personne connecté à un dossier
    @PostMapping("/addAccess/current_record/{name}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> addRecordAccountCurrentRecord(@PathVariable @SuppressWarnings("unused") String userName,
                                                           @RequestBody addRecordAccountRequest request,
                                                           @PathVariable String name) {
        Account account = accountService.getUser(name);
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
        if(request.getTitle().equals("Aidant") || request.getTitle().equals("AIDANT")) {
            newAccess.setTitle(Role.AIDANT);
        }
        else if(request.getTitle().equals("Employé") || request.getTitle().equals("EMPLOYEE")) {
            newAccess.setTitle(Role.EMPLOYEE);
        }
        else{
            newAccess.setTitle(Role.MEDECIN);
        }

        accountService.addRecordAccount(account, newAccess);

        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/deleteAccess/")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> deleteRecordAccount(@PathVariable String userName, @RequestBody deleteRecordAccountRequest request) {
        Account account = accountService.getUser(userName);
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
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> deleteRecordAccount(
            @PathVariable String userName,
            @PathVariable String targetUserName,
            @PathVariable Long recordId
    ) {
        Account account = accountService.getUser(userName);
                if (account == null)
                    return ResponseEntity.badRequest().body("Nom d'utilisateur inexistant");

        Account targetAccount = accountService.getUser(targetUserName);
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
    @PutMapping("/updateRoleAccess/current_record/{targetUserName}/{recordId}/{title}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> updateRoleRecordAccount(
            @PathVariable String userName,
            @PathVariable String targetUserName,
            @PathVariable Long recordId,
            @PathVariable String title
    ) {
        Role role;
        if(title.equals("Aidant")) {
            role = Role.AIDANT;
        }
        else {
            role = Role.EMPLOYEE;
        }

        Account account = accountService.getUser(userName);
                if (account == null)
                    return ResponseEntity.badRequest().body("Nom d'utilisateur inexistant");

        recordAccountService.updateRoleRecordAccount(targetUserName, recordId, role);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/logout")
    public ResponseEntity<?> logout(LogoutRequest logoutRequest, HttpServletRequest request) {

        String userName = logoutRequest.getUserName();
        Account account = accountRepository.findById(userName).orElse(null);
        if (account == null)
            return ResponseEntity.badRequest().body("Account not found");

        sessionService.logout(account);
        return ResponseEntity.ok().build();
    }

}