package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.repositories.EvenementRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EvenementController {

    private final EvenementRepository repository;

    // Injection du repository via le constructeur
    public EvenementController(EvenementRepository repository) {
        this.repository = repository;
    }
}
