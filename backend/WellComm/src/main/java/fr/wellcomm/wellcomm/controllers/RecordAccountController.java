package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.RecordAccountService;
import fr.wellcomm.wellcomm.domain.Role;
import fr.wellcomm.wellcomm.services.RecordService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/{userId}/records/{recordId}/")
@AllArgsConstructor
public class RecordAccountController {
    private final RecordAccountService recordAccountService;
    private final RecordAccountRepository recordAccountRepository;
    private final AccountService accountService;
    private final RecordService recordService;

    public record RecordAccountResponse(long id,
                                        LocalDateTime creationDate,
                                        String title,
                                        long accountUserId,
                                        String accountUserName,
                                        long recordId) {}
    public record ChangePermissionsRequest(String userName, List<Permission> permissions) {}

    @GetMapping("/permissions")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<Permission>> getPermissions(@PathVariable @SuppressWarnings("unused") long userId,
                                                           @PathVariable long recordId
    ) {
        RecordAccount ra = recordAccountService.getRecordAccount(userId, recordId);
        return ResponseEntity.ok(ra.getPermissions());
    }

    @GetMapping("/permissions/{assistantId}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<Permission>> getPermissions(@PathVariable @SuppressWarnings("unused") long userId,
                                                           @PathVariable long recordId,
                                                           @PathVariable long assistantId
    ) {
        RecordAccount ra = recordAccountService.getRecordAccount(assistantId, recordId);
        return ResponseEntity.ok(ra.getPermissions());
    }

    @GetMapping("/assistants")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<RecordAccountResponse>> getAssistantsByRecordId(
            @PathVariable long userId,
            @PathVariable long recordId) {

        List<RecordAccountResponse> assistants = recordAccountService.getByRecordId(recordId).stream()
                .filter(ra -> !ra.getAccount().getId().equals(userId) && ((ra.getTitle().equals(Role.EMPLOYEE.getTitre())) || (ra.getTitle().equals(Role.AIDANT.getTitre()))))
                .map(d -> new RecordAccountResponse(d.getId(),
                        d.getCreatedAt(),
                        d.getTitle(),
                        d.getAccount().getId(),
                        d.getAccount().getUserName(),
                        d.getRecord().getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(assistants);
    }

    @GetMapping("/medecin")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<RecordAccountResponse>> getByRecordId(
        @PathVariable long userId,
        @PathVariable long recordId) {

            List<RecordAccountResponse> assistants = recordAccountService.getByRecordId(recordId).stream()
                    .filter(ra -> !ra.getAccount().getId().equals(userId) && (ra.getTitle().equals(Role.MEDECIN.getTitre())))
                    .map(d -> new RecordAccountResponse(d.getId(),
                            d.getCreatedAt(),
                            d.getTitle(),
                            d.getAccount().getId(),
                            d.getAccount().getUserName(),
                            d.getRecord().getId()))
                    .collect(Collectors.toList());

        return ResponseEntity.ok(assistants);
    }

    @PutMapping("/changepermissions")
    @PreAuthorize("#userId.toString() == authentication.name and" +
            "@securityService.hasRecordAccountPermission(T(fr.wellcomm.wellcomm.domain.Permission).ASSIGN_PERMISSIONS)")
    public ResponseEntity<?> changePermissions(@PathVariable @SuppressWarnings("unused") Long userId,
                                               @PathVariable Long recordId,
                                               @RequestBody ChangePermissionsRequest request
    ) {
        Long requestUserId = accountService.getUserByUserName(request.userName).getId();
        RecordAccount recordAccount = recordAccountService.getRecordAccount(requestUserId, recordId);
        for (Permission p : request.permissions) {
            if (!recordAccount.getPermissions().contains(p)) {
                recordAccount.getPermissions().add(p);
            }
        }
        recordAccount.getPermissions().removeIf(permsrecordAccount -> !request.permissions.contains(permsrecordAccount));
        recordAccountRepository.save(recordAccount);
        return ResponseEntity.ok(recordAccount.getPermissions());
    }

    @GetMapping("/medecins")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<RecordAccountResponse>> getMedecinsByRecordId(
            @PathVariable long userId,
            @PathVariable long recordId) {

        List<RecordAccountResponse> medecins = recordAccountService.getByRecordId(recordId).stream()
                .filter(ra -> !ra.getAccount().getId().equals(userId))
                .filter(ra -> ra.getTitle().equals(Role.MEDECIN.getTitre()))
                .map(d -> new RecordAccountResponse(
                        d.getId(),
                        d.getCreatedAt(),
                        d.getTitle(),
                        d.getAccount().getId(),
                        d.getAccount().getUserName(),
                        d.getRecord().getId()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(medecins);
    }

    @PostMapping("/access/title/{title}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> addRecordAccount(@PathVariable Long userId,
                                              @PathVariable long recordId,
                                              @PathVariable String title) {
        Account account = accountService.getUser(userId);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        fr.wellcomm.wellcomm.entities.Record record = recordService.getRecord(recordId);
        if (record == null)
            return ResponseEntity.badRequest().body("Record not found");

        RecordAccount newAccess = new RecordAccount(account, record, Role.valueOf(title.toUpperCase()));

        accountService.addRecordAccount(account, newAccess);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/access/targetUser/{targetId}/title/{title}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> addRecordAccountCurrentRecord(@PathVariable @SuppressWarnings("unused") Long userId,
                                                           @PathVariable long targetId,
                                                           @PathVariable long recordId,
                                                           @PathVariable String title) {
        Account account = accountService.getUser(targetId);
        if (account == null)
            return ResponseEntity.badRequest().body("Nom d'utilisateur inexistant");

        Record record = recordService.getRecord(recordId);
        if (record == null)
            return ResponseEntity.badRequest().body("Dossier inexistant");

        Optional<RecordAccount> existing = recordAccountService.getByRecordId(recordId).stream()
                .filter(ra -> ra.getAccount().getId().equals(targetId))
                .findFirst();
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Cette personne à déjà été ajoutée");
        }

        RecordAccount newAccess = new RecordAccount(account, record, Role.valueOf(title.toUpperCase()));


        accountService.addRecordAccount(account, newAccess);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/access")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> deleteRecordAccount(@PathVariable long userId,
                                                 @PathVariable long recordId) {
        Account account = accountService.getUser(userId);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        RecordAccount recordAccount = account.getRecordAccounts().get(recordId);
        if (recordAccount == null)
            return ResponseEntity.badRequest().body("Access not found");

        accountService.deleteRecordAccount(account, recordAccount);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/access/targetUser/{targetId}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> deleteRecordAccount(
            @PathVariable long userId,
            @PathVariable long targetId,
            @PathVariable long recordId) {
        Account account = accountService.getUser(userId);
        if (account == null)
            return ResponseEntity.badRequest().body("Nom d'utilisateur inexistant");

        Account targetAccount = accountService.getUser(targetId);
        if (targetAccount == null) {
            return ResponseEntity.badRequest().body("Assistant introuvable");
        }

        RecordAccount recordAccount = targetAccount.getRecordAccounts().values()
                .stream()
                .filter(ra -> ra.getRecord().getId() == recordId)
                .findFirst()
                .orElse(null);

        if (recordAccount == null)
            return ResponseEntity.badRequest().body("Accès introuvable");

        accountService.deleteRecordAccount(targetAccount, recordAccount);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/access/targetUser/{targetId}/title/{title}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> updateRoleRecordAccount(
            @PathVariable @SuppressWarnings("unused") Long userId,
            @PathVariable long targetId,
            @PathVariable long recordId,
            @PathVariable String title
    ) {
        Account account = accountService.getUser(targetId);
        if (account == null)
            return ResponseEntity.badRequest().body("Nom d'utilisateur inexistant");

        Role role;
        if (title.equals("Aidant"))
            role = Role.AIDANT;
        else
            role = Role.EMPLOYEE;

        recordAccountService.updateRoleRecordAccount(targetId, recordService.getRecord(recordId), role);

        return ResponseEntity.ok().build();
    }
}