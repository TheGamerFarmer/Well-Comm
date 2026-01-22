package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Category;
import fr.wellcomm.wellcomm.domain.Role;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.CalendarRepository;
import fr.wellcomm.wellcomm.repositories.RecordRepository;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.RecordAccountService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import fr.wellcomm.wellcomm.services.RecordService;

@RestController
@RequestMapping("/api/{userId}/records")
@AllArgsConstructor
public class RecordController {
    private final RecordService recordService;
    private final AccountService accountService;
    private final RecordAccountService recordAccountService;
    private final RecordRepository recordRepository;
    private final CalendarRepository calendarRepository;
    public record CreateFilRequest(String title, Category category, String firstMessage) {}
    public record DossierResponse(long id, String name, long adminId) {}
    public record FilResponse(
        Long id,
        String title,
        Category category,
        Date creationDate,
        String lastMessage,
        String lastMessageAuthor
    ) {}

    @GetMapping("/")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<DossierResponse>> getRecords(@PathVariable long userId) {
        List<DossierResponse> dossiers = recordService.getRecords(userId).stream()
                .map(d -> new DossierResponse(d.getId(), d.getName(), d.getAdmin().getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dossiers);
    }

    @GetMapping("/{recordId}/name")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<String> getNameRecord(@PathVariable @SuppressWarnings("unused") long userId,
                                                @PathVariable long recordId) {
        Record record = recordService.getRecord(recordId);
        return ResponseEntity.ok(record.getName());
    }

    @PutMapping("/{recordId}/{newname}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<Void> changeNameRecord(@PathVariable @SuppressWarnings("unused") long userId,
                                                 @PathVariable long recordId,
                                                 @PathVariable String newname) {
        Record record = recordService.getRecord(recordId);
        record.setName(newname);
        recordRepository.save(record);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create/{name}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<Record> createRecord(@PathVariable long userId,
                                               @PathVariable String name) {
        Account account = accountService.getUser(userId);
        Record newRecord = recordService.createRecord(name, account);
        recordAccountService.createReccordAccount(account, newRecord, Role.AIDANT);
        return ResponseEntity.ok(newRecord);
    }

    @GetMapping("/{recordId}/channels/categorys/{category}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<FilResponse>> getChannelsFiltered(@PathVariable @SuppressWarnings("unused") long userId,
                                                                 @PathVariable long recordId,
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

    @GetMapping("/{recordId}/closechannels/categorys/{category}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<FilResponse>> getCloseChannelsFiltered(@PathVariable @SuppressWarnings("unused") long userId,
                                                                      @PathVariable long recordId,
                                                                      @PathVariable Category category) {
        List<FilResponse> response = recordService.getChannelsOfCategoryClose(recordId, category).stream()
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

    @GetMapping("/{recordId}/channels/categorys/{category}/week")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<FilResponse>> getLastWeekChannelsFiltered(@PathVariable @SuppressWarnings("unused") long userId,
                                                                         @PathVariable long recordId,
                                                                         @PathVariable Category category) {

        List<FilResponse> response = recordService.getLastWeekChannelsOfCategory(recordId, category).stream()
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
    @PreAuthorize("#userId.toString() == authentication.name and" +
            "@securityService.hasRecordPermission(T(fr.wellcomm.wellcomm.domain.Permission).OPEN_CHANNEL)")
    public ResponseEntity<?> createChannel(@PathVariable long userId,
                                           @PathVariable long recordId,
                                           @RequestBody CreateFilRequest request) {
        System.out.println("========================");
        Account account = accountService.getUser(userId);
        if (account == null)
            return ResponseEntity.badRequest().body("User not found");

        RecordAccount recordAccount = null;
        Map<Long, RecordAccount> recordAccounts = account.getRecordAccounts();
        for (Map.Entry<Long, RecordAccount> entry : recordAccounts.entrySet()) {
            if (entry.getValue().getRecord().getId() == recordId){
                recordAccount = entry.getValue();
            }
        }
        if (recordAccount == null)
            return ResponseEntity.badRequest().body("RecordAccount not found");

        Record record = recordAccount.getRecord();

        OpenChannel newChannel = recordService.createChannel(
                record,
                request.title,
                request.category,
                request.firstMessage,
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

    @PostMapping("/{recordId}/channels/{channelId}/archive")
    @PreAuthorize("#userId.toString() == authentication.name and" +
            "@securityService.hasRecordPermission(T(fr.wellcomm.wellcomm.domain.Permission).CLOSE_CHANNEL)")
    public ResponseEntity<?> archiveChannel(@PathVariable @SuppressWarnings("unused") long userId,
                                            @PathVariable long recordId,
                                            @PathVariable long channelId) {
        Record record = recordService.getRecord(recordId);
        if (record == null) {
            return ResponseEntity.badRequest().body("Record not found");
        }


        recordService.archiveChannel(record, channelId);
        return ResponseEntity.ok().build();
    }

    @Transactional
    @DeleteMapping("/delete/{recordId}")
    @PreAuthorize("#userId.toString() == authentication.name and @securityService.deleteRecord()")
    public ResponseEntity<Void> deleteDossier(@PathVariable @SuppressWarnings("unused") long userId,
                                              @PathVariable long recordId) {
        calendarRepository.deleteById(recordId);
        boolean deleted = recordService.deleteRecord(recordId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}