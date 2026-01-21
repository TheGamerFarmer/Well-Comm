package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.RecordAccountService;
import fr.wellcomm.wellcomm.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/{userId}/recordsaccount")
@AllArgsConstructor
public class RecordAccountController {
    private final RecordAccountService recordAccountService;
    private final RecordAccountRepository recordAccountRepository;
    private final AccountService accountService;

    @Getter
@Setter
@AllArgsConstructor
public static class RecordAccountResponse {
    private Long id;
    private LocalDateTime dateCreation;
    private String title;
    private String accountUserName;
    private Long recordId;
}

@Getter
@Setter
public static class PermissionsRequest {
    public String userName;
}


@Getter
@Setter
public static class ChangePermissionsRequest {
    public String userName;
    public List<Permission> permissions;
}

    @GetMapping("/{recordId}/permissions")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<Permission>> getPermissions(@PathVariable @SuppressWarnings("unused") Long userId,
                                                                                 @PathVariable Long recordId
    ) {
        RecordAccount ra = recordAccountService.getRecordAccount(userId, recordId);
        return ResponseEntity.ok(ra.getPermissions());
    }

    @GetMapping("/{recordId}/autrepermissions/{assistantName}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<Permission>> getautrePermissions(@PathVariable @SuppressWarnings("unused") Long userId,
                                                           @PathVariable Long recordId,
                                                                @PathVariable String assistantName

    ) {
        Long requestUserId = accountService.getUserByUserName(assistantName).getId();
        RecordAccount ra = recordAccountService.getRecordAccount(requestUserId, recordId);
        return ResponseEntity.ok(ra.getPermissions());
    }

    @GetMapping("/{recordId}/assistants")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<RecordAccountResponse>> getAssistantsByRecordId(
            @PathVariable Long userId,
            @PathVariable Long recordId) {

        List<RecordAccountResponse> assistants = recordAccountService.getByRecordId(recordId).stream()
                .filter(ra -> !ra.getAccount().getId().equals(userId) && ((ra.getTitle().equals(Role.EMPLOYEE.getTitre())) || (ra.getTitle().equals(Role.AIDANT.getTitre()))))
                .map(d -> new RecordAccountResponse(d.getId(), d.getCreatedAt(), d.getTitle(), d.getAccount().getUserName(), d.getRecord().getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(assistants);
    }

    @GetMapping("/{recordId}/medecin")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<RecordAccountResponse>> getByRecordId(
        @PathVariable Long userId,
        @PathVariable Long recordId) {

            List<RecordAccountResponse> assistants = recordAccountService.getByRecordId(recordId).stream()
                    .filter(ra -> !ra.getAccount().getId().equals(userId) && (ra.getTitle().equals(Role.MEDECIN.getTitre())))
                    .map(d -> new RecordAccountResponse(d.getId(), d.getCreatedAt(), d.getTitle(), d.getAccount().getUserName(), d.getRecord().getId()))
                    .collect(Collectors.toList());

        return ResponseEntity.ok(assistants);
    }

    @PutMapping("/{recordId}/changepermissions")
    @PreAuthorize("#userId.toString() == authentication.name and @securityService.hasRecordAccountPermission(T(fr.wellcomm.wellcomm.domain.Permission).ASSIGN_PERMISSIONS)")
    public ResponseEntity<?> changePermissions(@PathVariable @SuppressWarnings("unused") Long userId,
                                                           @PathVariable Long recordId,
                                                            @RequestBody ChangePermissionsRequest request
    ) {
        Long requestUserId = accountService.getUserByUserName(request.userName).getId();
        RecordAccount recordAccount = recordAccountService.getRecordAccount(requestUserId, recordId);
        for (Permission p : request.getPermissions()) {
            if (!recordAccount.getPermissions().contains(p)) {
                recordAccount.getPermissions().add(p);
            }
        }
        recordAccount.getPermissions().removeIf(permsrecordAccount -> !request.getPermissions().contains(permsrecordAccount));
        recordAccountRepository.save(recordAccount);
        return ResponseEntity.ok(recordAccount.getPermissions());
}

    @GetMapping("/{recordId}/medecins")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<RecordAccountResponse>> getMedecinsByRecordId(
            @PathVariable Long userId,
            @PathVariable Long recordId) {

        List<RecordAccountResponse> medecins = recordAccountService.getByRecordId(recordId).stream()
                .filter(ra -> !ra.getAccount().getId().equals(userId))
                .filter(ra -> ra.getTitle().equals(Role.MEDECIN.getTitre()))
                .map(d -> new RecordAccountResponse(
                        d.getId(),
                        d.getCreatedAt(),
                        d.getTitle(),
                        d.getAccount().getUserName(),
                        d.getRecord().getId()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(medecins);
    }


    }