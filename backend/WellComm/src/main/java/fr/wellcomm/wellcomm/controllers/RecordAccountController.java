package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.services.RecordAccountService;
import fr.wellcomm.wellcomm.services.RecordService;
import fr.wellcomm.wellcomm.entities.Account;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import fr.wellcomm.wellcomm.entities.*;
import java.util.List;
import java.util.Date;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/{userName}/recordsaccount")
@AllArgsConstructor
public class RecordAccountController {
    private final RecordAccountService recordAccountService;

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

    @GetMapping("/{recordId}/permissions")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<Permission>> getPermissions(@PathVariable @SuppressWarnings("unused") String userName,
                                                                                 @PathVariable Long recordId
    ) {
        RecordAccount ra = recordAccountService.getRecordAccount(userName, recordId);
        return ResponseEntity.ok(ra.getPermissions());
    }

    @GetMapping("/{recordId}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<RecordAccountResponse>> getByRecordId(
        @PathVariable String userName,
        @PathVariable Long recordId) {

            List<RecordAccountResponse> assistants = recordAccountService.getByRecordId(recordId).stream()
                    .filter(ra -> !ra.getAccount().getUserName().equals(userName))
                    .map(d -> new RecordAccountResponse(d.getId(), d.getCreatedAt(), d.getTitle(), d.getAccount().getUserName(), d.getRecord().getId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(assistants);
        }


}