package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.services.RecordAccountService;
import fr.wellcomm.wellcomm.services.RecordService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/{userName}/recordsaccount")
@AllArgsConstructor
public class RecordAccountController {
    private final RecordAccountService recordAccountService;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class AssistantResponse {
        private Long id;
        private Date date_creation;
        private String title;
        private String account_user_name;
        private Long record_id;
    }

    @GetMapping("/{recordId}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<AssistantResponse>> getRecordAccounts(@PathVariable String userName, @PathVariable Long id) {
            List<AssistantResponse> assistants = recordAccountService.getRecordAccounts(id).stream()
                    .map(d -> new AssistantResponse(d.getId(), d.getDateCreation(), d.getTitle(), d.getAccount.getUserName(), d.getRecord().getId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(assistants);
        }

}