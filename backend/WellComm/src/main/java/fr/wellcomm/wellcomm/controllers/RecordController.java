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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import fr.wellcomm.wellcomm.services.RecordService;
import fr.wellcomm.wellcomm.entities.Session;
import fr.wellcomm.wellcomm.repositories.SessionRepository;


@RestController
@RequestMapping("/api/{userId}/records")
@AllArgsConstructor
public class RecordController {
    private final RecordService recordService;
    private final AccountService accountService;
    private final RecordAccountService recordAccountService;
    private final RecordRepository recordRepository;
    private final SessionRepository sessionRepository;
    private final CalendarRepository calendarRepository;

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
        private Long admin;
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
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<DossierResponse>> getRecords(@PathVariable Long userId) {
        List<DossierResponse> dossiers = recordService.getRecords(userId).stream()
                .map(d -> new DossierResponse(d.getId(), d.getName(), d.getAdmin()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dossiers);
    }

    @GetMapping("/{recordId}/name")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<String> getNameRecord(@PathVariable @SuppressWarnings("unused") String userName, @PathVariable long recordId) {
        Record record = recordService.getRecord(recordId);
        return ResponseEntity.ok(record.getName());
    }

    @PutMapping("/{recordId}/{newname}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<Void> changeNameRecord(@PathVariable @SuppressWarnings("unused") String userName, @PathVariable long recordId, @PathVariable String newname) {
        Record record = recordService.getRecord(recordId);
        record.setName(newname);
        recordRepository.save(record);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create/{name}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<Record> createRecord(@PathVariable Long userId,
                                               @PathVariable String name) {

        Record newRecord = recordService.createRecord(name, userId);
        recordAccountService.createReccordAccount(accountService.getUser(userId), newRecord, Role.AIDANT);
        return ResponseEntity.ok(newRecord);
    }

    @GetMapping("/{recordId}/channels/{category}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<FilResponse>> getChannelsFiltered(@PathVariable @SuppressWarnings("unused") Long userId,
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

    @GetMapping("/{recordId}/closechannels/{category}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<FilResponse>> getCloseChannelsFiltered(@PathVariable @SuppressWarnings("unused") Long userId,
                                                                 @PathVariable Long recordId,
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

    @GetMapping("/{recordId}/channels/{category}/week")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<List<FilResponse>> getLastWeekChannelsFiltered(@PathVariable @SuppressWarnings("unused") Long userId,
                                                                 @PathVariable Long recordId,
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
    public ResponseEntity<?> createChannel(@PathVariable Long userId,
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

    @PostMapping("/{recordId}/channels/{channelId}/archive")
    @PreAuthorize("#userId.toString() == authentication.name and" +
            "@securityService.hasRecordPermission(T(fr.wellcomm.wellcomm.domain.Permission).CLOSE_CHANNEL)")
    public ResponseEntity<?> archiveChannel(@PathVariable @SuppressWarnings("unused") Long userId,
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
    public ResponseEntity<Void> deleteDossier(@PathVariable @SuppressWarnings("unused") Long userId,
                                              @PathVariable Long recordId) {
        calendarRepository.deleteById(recordId);
        boolean deleted = recordService.deleteRecord(recordId);
        if (deleted) {
            return ResponseEntity.noContent().build(); // 204
        } else {
            return ResponseEntity.notFound().build(); // 404
        }
    }
    //création d'une session quand on selectionne un dossier
    @PostMapping("/select/{recordId}")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> selectRecord(
            @PathVariable @SuppressWarnings("unused") Long userId,
            @CookieValue("token") String token,
            @PathVariable Long recordId
    ) {
          // Vérifie que la session existe pour ce token
          Session session = sessionRepository.findById(token)
                  .orElseThrow(() -> new RuntimeException("Session invalide"));


          // Enregistre le recordId sélectionné
          session.setCurrentRecordId(recordId);
          sessionRepository.save(session);
          return ResponseEntity.ok().build();
      }

    //return current-record
    @GetMapping("/current-record")
    @PreAuthorize("#userId.toString() == authentication.name")
    public ResponseEntity<?> getCurrentRecord(
            @PathVariable @SuppressWarnings("unused") Long userId,
            @CookieValue("token") String token
    ) {
          // Récupère la session par le token
          Session session = sessionRepository.findById(token)
                            .orElseThrow(() -> new RuntimeException("Session invalide"));

          Long currentRecordId = session.getCurrentRecordId();
          if (currentRecordId == null) {
              return ResponseEntity.noContent().build(); // 204 si aucun dossier sélectionné
          }

          return ResponseEntity.ok(currentRecordId); // Retourne juste l'ID du dossier courant
      }
}