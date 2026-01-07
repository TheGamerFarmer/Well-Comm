package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Fil;
import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.repositories.FilRepository;
import fr.wellcomm.wellcomm.repositories.MessageRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api/{userName}/fils")
@RestController
public class FilController {

    private final FilRepository repository;
    private final MessageRepository messageRepository;

    // Injection du repository via le constructeur
    public FilController(FilRepository repository, MessageRepository messageRepository) {
        this.repository = repository;
        this.messageRepository = messageRepository;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class MessageResponse {
        private Long id;
        private String contenu;
        private Date dateEnvoi;
        private String auteurNom;
        private String auteurRole;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class FilDetailResponse {
        private Long id;
        private String titre;
        private String categorie;
        private List<MessageResponse> messages;
    }

    @Getter
    @Setter
    public static class MessageRequest {
        private String contenu;
        private String auteurRole; // Optionnel si géré par le backend
    }

    // 1. Récupérer tout un fil avec ses messages
    @GetMapping("/{filId}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<FilDetailResponse> getFilComplet(@PathVariable String userName, @PathVariable Long filId) {
        Fil fil = repository.findById(filId)
                .orElseThrow(() -> new RuntimeException("Fil non trouvé"));

        List<MessageResponse> messages = fil.getMessages().stream()
                .map(m -> new MessageResponse(m.getId(), m.getContenu(), m.getDateEnvoi(), m.getAuteurNom(), m.getAuteurRole()))
                .collect(Collectors.toList());

        FilDetailResponse response = new FilDetailResponse(
                fil.getId(),
                fil.getTitre(),
                fil.getCategorie().toString(),
                messages
        );

        return ResponseEntity.ok(response);
    }

    // 2. Envoyer un nouveau message (Action bouton envoyer)
    @PostMapping("/{filId}/messages")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<MessageResponse> ajouterMessage(
            @PathVariable String userName,
            @PathVariable Long filId,
            @RequestBody MessageRequest request) {

        Fil fil = repository.findById(filId)
                .orElseThrow(() -> new RuntimeException("Fil non trouvé"));

        // Création et sauvegarde du message
        Message message = new Message();
        message.setContenu(request.getContenu());
        message.setAuteurNom(userName);
        message.setAuteurRole(request.getAuteurRole() != null ? request.getAuteurRole() : "Utilisateur");
        message.setDateEnvoi(new Date());
        message.setFil(fil);

        Message messageSauve = messageRepository.save(message);

        // Retourne le message formaté pour le frontend
        return ResponseEntity.ok(new MessageResponse(
                messageSauve.getId(),
                messageSauve.getContenu(),
                messageSauve.getDateEnvoi(),
                messageSauve.getAuteurNom(),
                messageSauve.getAuteurRole()
        ));
    }
}
