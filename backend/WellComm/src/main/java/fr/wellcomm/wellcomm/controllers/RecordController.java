package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Category;
import fr.wellcomm.wellcomm.domain.Role;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.RecordAccountService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import fr.wellcomm.wellcomm.services.RecordService;

@RestController
@RequestMapping("/api/{userName}/records")
@AllArgsConstructor
public class RecordController {
    private final RecordService recordService;
    private final AccountService accountService;
    private final RecordAccountService recordAccountService;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class CreateFilRequest {
        private String title;
        private Category category;
        private String firstMessage;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class DossierResponse {
        private Long id;
        private String name;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class FilResponse {
        private Long id;
        private String title;
        private Category category;
        private Date creationDate;
        private String lastMessage;
        private String lastMessageAuthor;
    }

    @GetMapping("/")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<DossierResponse>> getRecords(@PathVariable String userName) {
        List<DossierResponse> dossiers = recordService.getRecords(userName).stream()
                .map(d -> new DossierResponse(d.getId(), d.getName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dossiers);
    }

    @PostMapping("/create/{name}")
    @PreAuthorize("#userName == authentication.name")
    public Record createRecord(@PathVariable @SuppressWarnings("unused") String userName,
                                               @PathVariable String name) {

        Record newRecord = recordService.createRecord(name);
        Role aide = Role.AIDANT;
        RecordAccount newRecordAccount = recordAccountService.createReccordAccount(accountService.getUser(userName), newRecord, aide);
        return newRecord;
    }

    @GetMapping("/{recordId}/channels/{category}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<FilResponse>> getChannelsFiltered(@PathVariable @SuppressWarnings("unused") String userName,
            @PathVariable Long recordId,
            @PathVariable Category category) {

        List<FilResponse> response = recordService.getChannelsOfCategory(recordId, category).stream()
                .map(f -> {
                    Message lastMsg = f.getLastMessage();
                    return new FilResponse(
                            f.getId(), f.getTitle(), f.getCategory(), f.getCreationDate(),
                            lastMsg != null ? lastMsg.getContent() : "Aucun message",
                            lastMsg != null ? lastMsg.getAuthor().getUserName() : ""
                    );
                }).collect(Collectors.toList());

        return response.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(response);
    }

    @PostMapping("/{recordId}/channels/new")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> createChannel(@PathVariable String userName,
            @PathVariable long recordId,
            @RequestBody CreateFilRequest request) {
        Account account = accountService.getUser(userName);
        if (account == null)
            return ResponseEntity.badRequest().body("Message not found");
        RecordAccount recordAccount = new RecordAccount();
        int i = 0;
        while (i < account.getRecordAccounts().size()){
            if (account.getRecordAccounts().get(i).getId() == recordId){
                recordAccount = account.getRecordAccounts().get(i);
            }
            i++;
        }
        if (i == account.getRecordAccounts().size())
            return ResponseEntity.badRequest().body("RecordAccount not found");
        Record record = recordAccount.getRecord();
        if (record == null)
            return ResponseEntity.badRequest().body("Record not found");

        OpenChannel newChannel = recordService.createChannel(
                record,
                request.getTitle(),
                request.getCategory(),
                request.getFirstMessage(),
                account
        );

        Message lastMsg = newChannel.getLastMessage();

        return ResponseEntity.ok(new FilResponse(
                newChannel.getId(),
                newChannel.getTitle(),
                newChannel.getCategory(),
                newChannel.getCreationDate(),
                lastMsg != null ? lastMsg.getContent() : "",
                lastMsg != null ? lastMsg.getAuthor().getUserName() : ""
        ));
    }

    @GetMapping("/{recordId}/channels/{channelId}/archive")
    @PreAuthorize("#userName == authentication.name") // il faudra vérifier ici si l'utilisateur à les droits de fermer un fil
    public ResponseEntity<?> archiveChannel(@PathVariable @SuppressWarnings("unused") String userName,
            @PathVariable long recordId,
            @PathVariable long channelId) {

        Record record = recordService.getRecord(recordId);
        if (record == null) {
            return ResponseEntity.badRequest().body("Record not found");
        }


        recordService.archiveChannel(record, channelId);
        return ResponseEntity.ok().build();
    }
}