package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Fil;
import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.repositories.FilRepository;
import fr.wellcomm.wellcomm.repositories.MessageRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class FilController {

    private final FilRepository repository;
    private final MessageRepository messageRepository;

    // Injection du repository via le constructeur
    public FilController(FilRepository repository, MessageRepository messageRepository) {
        this.repository = repository;
        this.messageRepository = messageRepository;
    }

    // 1. Récupérer tout un fil avec ses messages
    @GetMapping("/{filId}")
    @PreAuthorize("#userName == authentication.name")
    public Fil getFilComplet(@PathVariable String userName, @PathVariable Long filId) {
        return repository.findById(filId)
                .orElseThrow(() -> new RuntimeException("Fil non trouvé"));
    }

    // 2. Envoyer un nouveau message dans le fil
    @PostMapping("/{filId}/messages")
    @PreAuthorize("#userName == authentication.name")
    public Message ajouterMessage(
            @PathVariable String userName,
            @PathVariable Long filId,
            @RequestBody Message nouveauMessage) {

        Fil fil = repository.findById(filId).get();

        // On prépare le message (on pourrait récupérer le rôle de l'user connecté ici)
        nouveauMessage.setDateEnvoi(new java.util.Date());
        nouveauMessage.setAuteurNom(userName);

        // Sauvegarde
        Message messageSauve = messageRepository.save(nouveauMessage);
        fil.envoyerMessage(messageSauve);
        repository.save(fil);

        return messageSauve;
    }
}
