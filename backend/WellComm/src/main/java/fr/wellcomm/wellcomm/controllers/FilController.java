package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.repositories.FilRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FilController {

    private final FilRepository repository;

    // Injection du repository via le constructeur
    public FilController(FilRepository repository) {
        this.repository = repository;
    }
}
