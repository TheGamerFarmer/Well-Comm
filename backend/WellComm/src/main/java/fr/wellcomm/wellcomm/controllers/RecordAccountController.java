package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
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
@RequestMapping("/api/{userName}/recordsaccount")
@AllArgsConstructor
public class RecordAccountController {
    private final RecordAccountService recordAccountService;
    private final RecordAccountRepository recordAccountRepository;

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
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<Permission>> getPermissions(@PathVariable @SuppressWarnings("unused") String userName,
                                                                                 @PathVariable Long recordId
    ) {
        RecordAccount ra = recordAccountService.getRecordAccount(userName, recordId);
        return ResponseEntity.ok(ra.getPermissions());
    }

    @GetMapping("/{recordId}/autrepermissions/{assistantName}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<Permission>> getautrePermissions(@PathVariable @SuppressWarnings("unused") String userName,
                                                           @PathVariable Long recordId,
                                                                @PathVariable String assistantName

    ) {
        RecordAccount ra = recordAccountService.getRecordAccount(assistantName, recordId);
        return ResponseEntity.ok(ra.getPermissions());
    }

    //liste des record_accounts d'assistants d'un dossier
    @GetMapping("/{recordId}/assistants")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<RecordAccountResponse>> getAssistantsByRecordId(
            @PathVariable String userName,
            @PathVariable Long recordId) {

        List<RecordAccountResponse> assistants = recordAccountService.getByRecordId(recordId).stream()
                .filter(ra -> !ra.getAccount().getUserName().equals(userName) && (ra.getTitle() == Role.EMPLOYEE))
                .map(d -> new RecordAccountResponse(d.getId(), d.getCreatedAt(), d.getTitle().getTitre(), d.getAccount().getUserName(), d.getRecord().getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(assistants);
    }

    //liste des record_accounts de médecin d'un dossier
    @GetMapping("/{recordId}/medecin")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<RecordAccountResponse>> getByRecordId(
            @PathVariable String userName,
            @PathVariable Long recordId) {

        List<RecordAccountResponse> assistants = recordAccountService.getByRecordId(recordId).stream()
                .filter(ra -> !ra.getAccount().getUserName().equals(userName) && (ra.getTitle() == Role.MEDECIN))
                .map(d -> new RecordAccountResponse(d.getId(), d.getCreatedAt(), d.getTitle().getTitre(), d.getAccount().getUserName(), d.getRecord().getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(assistants);
    }

    @PutMapping("/{recordId}/changepermissions")
    @PreAuthorize("#userName == authentication.name and @securityService.hasRecordAccountPermission(T(fr.wellcomm.wellcomm.domain.Permission).ASSIGN_PERMISSIONS)")
    public ResponseEntity<?> changePermissions(@PathVariable @SuppressWarnings("unused") String userName,
                                                           @PathVariable Long recordId,
                                                            @RequestBody ChangePermissionsRequest request
    ) {
        RecordAccount recordAccount = recordAccountService.getRecordAccount(request.userName, recordId);
        for (Permission p : request.getPermissions()) {
            if (!recordAccount.getPermissions().contains(p)) {
                recordAccount.getPermissions().add(p);
            }
        }
        recordAccount.getPermissions().removeIf(permsrecordAccount -> !request.getPermissions().contains(permsrecordAccount));
        recordAccountRepository.save(recordAccount);
        return ResponseEntity.ok(recordAccount.getPermissions());
}

    //liste des medecins
    @GetMapping("/{recordId}/medecins")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<RecordAccountResponse>> getMedecinsByRecordId(
            @PathVariable String userName,
            @PathVariable Long recordId) {

        List<RecordAccountResponse> medecins = recordAccountService.getByRecordId(recordId).stream()
                .filter(ra -> !ra.getAccount().getUserName().equals(userName))
                .filter(ra -> ra.getTitle() == Role.MEDECIN)

                .map(d -> new RecordAccountResponse(
                        d.getId(),
                        d.getCreatedAt(),
                        d.getTitle().getTitre(),
                        d.getAccount().getUserName(),
                        d.getRecord().getId()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(medecins);
    }


    }