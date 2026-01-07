package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.services.ChannelService;
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
@RequestMapping("/api/record/{userName}")
@AllArgsConstructor
public class RecordController {
    private final RecordService recordService;
    private final ChannelService channelService;

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

    @GetMapping("/{dossierId}/channel/{category}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<FilResponse>> getChannelsFiltered(@PathVariable @SuppressWarnings("unused") String userName,
            @PathVariable Long dossierId,
            @PathVariable Category category) {

        List<FilResponse> response = recordService.getChannelsOfCategory(dossierId, category).stream()
                .map(f -> {
                    Message lastMsg = channelService.getLastMessage(f);
                    return new FilResponse(
                            f.getId(), f.getTitle(), f.getCategory(), f.getCreationDate(),
                            lastMsg != null ? lastMsg.getContent() : "Aucun message",
                            lastMsg != null ? lastMsg.getAuthorName() : ""
                    );
                }).collect(Collectors.toList());

        return response.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(response);
    }

    @PostMapping("/{recordId}/channel/new")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> createChannel(@PathVariable String userName,
            @PathVariable long recordId,
            @RequestBody CreateFilRequest request) {
        Record record = recordService.getRecord(recordId);
        if (record == null)
            return ResponseEntity.badRequest().body("Record not found");

        OpenChannel newChannel = recordService.createChannel(
                record,
                request.getTitle(),
                request.getCategory(),
                request.getFirstMessage(),
                userName
        );

        Message lastMsg = channelService.getLastMessage(newChannel);

        return ResponseEntity.ok(new FilResponse(
                newChannel.getId(),
                newChannel.getTitle(),
                newChannel.getCategory(),
                newChannel.getCreationDate(),
                lastMsg != null ? lastMsg.getContent() : "",
                lastMsg != null ? lastMsg.getAuthorName() : ""
        ));
    }
}