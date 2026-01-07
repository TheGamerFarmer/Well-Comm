package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.repositories.CompteParDossierRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CompteParDossierController {

    private final CompteParDossierRepository repository;

    public CompteParDossierController(CompteParDossierRepository repository) {
        this.repository = repository;
    }

}