package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.repositories.MessageRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    private final MessageRepository repository;

    // Injection du repository via le constructeur
    public MessageController(MessageRepository repository) {
        this.repository = repository;
    }
}
