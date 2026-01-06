package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.repositories.DossierRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DossierController {

    private final DossierRepository repository;

    // Injection du repository via le constructeur
    public DossierController(DossierRepository repository) {
        this.repository = repository;
    }
}