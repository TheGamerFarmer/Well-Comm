package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.RecordAccountService;
import fr.wellcomm.wellcomm.domain.Role;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/{userId}/records/{recordId}/")
@AllArgsConstructor
public class RecordAccountController {
    private final RecordAccountService recordAccountService;
    private final RecordAccountRepository recordAccountRepository;
    private final AccountService accountService;
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
}