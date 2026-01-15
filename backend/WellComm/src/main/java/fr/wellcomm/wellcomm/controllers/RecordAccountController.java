package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.services.RecordAccountService;
import fr.wellcomm.wellcomm.services.RecordService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import fr.wellcomm.wellcomm.entities.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/{userName}/recordsaccount")
@AllArgsConstructor
public class RecordAccountController {
    private final RecordAccountService recordAccountService;

    @GetMapping("/{recordId}/permissions")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<Permission>> getPermissions(@PathVariable @SuppressWarnings("unused") String userName,
                                                                                 @PathVariable Long recordId
    ) {
        RecordAccount ra = recordAccountService.getRecordAccount(userName, recordId);
        System.out.println("Permissions " + ra.getPermissions());
        return ResponseEntity.ok(ra.getPermissions());
    }
}