package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.RecordService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/{userName}")
@AllArgsConstructor
public class AccountController {
    public final AccountService accountService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RecordService recordService;

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
        newAccess.setTitle(request.getTitle());

        accountService.addRecordAccount(account, newAccess);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteAccess/")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> deleteRecordAccount(@PathVariable String userName, @RequestBody deleteRecordAccountRequest request) {
        Account account = accountService.getUser(userName);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        RecordAccount recordAccount = new RecordAccount();
        int i = 0;
        while (i < account.getRecordAccounts().size()){
            if (account.getRecordAccounts().get(i).getId() == request.getRecordId()){
                recordAccount = account.getRecordAccounts().get(i);
            }
            i++;
        }

        if (i == account.getRecordAccounts().size())
            return ResponseEntity.badRequest().body("Access not found");

        accountService.deleteRecordAccount(account, recordAccount);

        return ResponseEntity.ok().build();
    }
}
