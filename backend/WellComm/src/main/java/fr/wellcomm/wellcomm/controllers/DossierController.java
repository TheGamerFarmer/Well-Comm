package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Categorie;
import fr.wellcomm.wellcomm.entities.Dossier;
import fr.wellcomm.wellcomm.entities.Fil;
import fr.wellcomm.wellcomm.repositories.DossierRepository;
import fr.wellcomm.wellcomm.repositories.FilRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/{userName}")
public class DossierController {

    private final DossierRepository repository;
    private final FilRepository filRepository;

    // Injection du repository via le constructeur
    public DossierController(DossierRepository repository, FilRepository filRepository) {
        this.repository = repository;
        this.filRepository = filRepository;
    }

    @GetMapping("/dossiers")
    @PreAuthorize("#userName == authentication.name")
    public List<String> getNomsDossiersAccessibles(@PathVariable String userName) {
        List<Dossier> dossiers = repository.findDossiersByUtilisateurUserName(userName);

        return dossiers.stream()
                .map(Dossier::getNom)
                .collect(Collectors.toList());
    }


    // URL : GET /api/userName/dossiers/1/fils?categorie=SANTE
    @PreAuthorize("#userName == authentication.name")
    @GetMapping("dossiers/{dossierId}/fils")
    public List<Fil> getFilsParCategorie(
            @PathVariable Long dossierId,
            @RequestParam Categorie categorie) {

        return filRepository.findByDossierIdAndCategorie(dossierId, categorie);
    }


}