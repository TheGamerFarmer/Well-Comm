package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.repositories.CompteParDossierRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class CompteParDossierController {
    private final CompteParDossierRepository repository;
}