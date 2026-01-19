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
import java.util.Map;
import java.util.stream.Collectors;
import fr.wellcomm.wellcomm.services.RecordService;
import fr.wellcomm.wellcomm.entities.Session;
import fr.wellcomm.wellcomm.repositories.SessionRepository;


@RestController
@RequestMapping("/api/{userName}/records")
@AllArgsConstructor
public class RecordController {
    private final RecordService recordService;
    private final AccountService accountService;
    private final RecordAccountService recordAccountService;
    private final SessionRepository sessionRepository;

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
        private String admin;
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
                .map(d -> new DossierResponse(d.getId(), d.getName(), d.getAdmin()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dossiers);
    }

    @PostMapping("/create/{name}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<Record> createRecord(@PathVariable String userName,
                                               @PathVariable String name) {
        Record newRecord = recordService.createRecord(name, userName);
        recordAccountService.createReccordAccount(accountService.getUser(userName), newRecord, Role.AIDANT);
        return ResponseEntity.ok(newRecord);
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

    @GetMapping("/{recordId}/closechannels/{category}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<FilResponse>> getCloseChannelsFiltered(@PathVariable @SuppressWarnings("unused") String userName,
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

    @PostMapping("/{recordId}/channels/new")
    @PreAuthorize("#userName == authentication.name and" +
            "@securityService.hasRecordPermission(T(fr.wellcomm.wellcomm.domain.Permission).OPEN_CHANNEL)")
    public ResponseEntity<?> createChannel(@PathVariable String userName,
                                           @PathVariable long recordId,
                                           @RequestBody CreateFilRequest request) {
        Account account = accountService.getUser(userName);
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

    @PostMapping("/{recordId}/channels/{channelId}/archive")
    @PreAuthorize("#userName == authentication.name and" +
            "@securityService.hasRecordPermission(T(fr.wellcomm.wellcomm.domain.Permission).CLOSE_CHANNEL)")
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

    @DeleteMapping("/delete/{recordId}")
    @PreAuthorize("#userName == authentication.name and @securityService.deleteRecord()")
    public ResponseEntity<Void> deleteDossier(@PathVariable @SuppressWarnings("unused") String userName,
                                              @PathVariable Long recordId) {
        boolean deleted = recordService.deleteRecord(recordId);
        if (deleted) {
            return ResponseEntity.noContent().build(); // 204
        } else {
            return ResponseEntity.notFound().build(); // 404
        }
    }
    //création d'une session quand on selectionne un dossier
    @PostMapping("/select/{recordId}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> selectRecord(
            @PathVariable @SuppressWarnings("unused") String userName,
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
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> getCurrentRecord(
            @PathVariable @SuppressWarnings("unused") String userName,
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