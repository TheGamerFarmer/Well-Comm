package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Fil;
import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.services.FilService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/{userName}/fils")
@AllArgsConstructor
public class FilController {
    private final FilService filService;

    // --- DTOs (Data Transfer Objects) ---
    @Getter @Setter @AllArgsConstructor
    public static class MessageResponse {
        private Long id;
        private String contenu;
        private Date dateEnvoi;
        private String auteurNom;
        private String auteurRole;
    }

    @Getter @Setter @AllArgsConstructor
    public static class FilDetailResponse {
        private Long id;
        private String titre;
        private String categorie;
        private List<MessageResponse> messages;
    }

    @Getter @Setter
    public static class MessageRequest {
        private String contenu;
        private String auteurRole;
    }

    // --- Points de terminaison (Endpoints) ---

    // Récupérer tout un fil avec ses messages
    @GetMapping("/{filId}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<FilDetailResponse> getFilComplet(@PathVariable String userName, @PathVariable Long filId) {
        Fil fil = filService.getFilById(filId);

        List<MessageResponse> messages = fil.getMessages().stream()
                .map(m -> new MessageResponse(m.getId(), m.getContenu(), m.getDateEnvoi(), m.getAuteurNom(), m.getAuteurRole()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new FilDetailResponse(
                fil.getId(),
                fil.getTitre(),
                fil.getCategorie().toString(),
                messages
        ));
    }

    // Envoyer un nouveau message
    @PostMapping("/{filId}/messages")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<MessageResponse> ajouterMessage(
            @PathVariable String userName,
            @PathVariable Long filId,
            @RequestBody MessageRequest request) {

        Message msg = filService.ajouterMessageAuFil(filId, request.getContenu(), userName);

        return ResponseEntity.ok(new MessageResponse(
                msg.getId(),
                msg.getContenu(),
                msg.getDateEnvoi(),
                msg.getAuteurNom(),
                msg.getAuteurRole()
        ));}
}
