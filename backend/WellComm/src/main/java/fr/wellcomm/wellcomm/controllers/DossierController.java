package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Categorie;
import fr.wellcomm.wellcomm.entities.Fil;
import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.repositories.DossierRepository;
import fr.wellcomm.wellcomm.repositories.FilRepository;
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
@RequestMapping("/api/{userName}")
@AllArgsConstructor
public class DossierController {
    private final DossierRepository repository;
    private final FilRepository filRepository;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class DossierResponse {
        private Long id;
        private String nom;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class FilResponse {
        private Long id;
        private String titre;
        private Categorie categorie;
        private Date dateCreation;
        private String dernierMessageContenu;
        private String dernierMessageAuteur;
    }

    @GetMapping("/dossiers")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<DossierResponse>> getDossiersAccessibles(@PathVariable String userName) {
        List<DossierResponse> dossiers = repository.findDossiersByUtilisateurUserName(userName).stream()
                .map(d -> new DossierResponse(d.getId(), d.getNom()))
                .collect(Collectors.toList());

        // On renvoie explicitement un 200 OK avec les données
        return ResponseEntity.ok(dossiers);
    }

    @GetMapping("/dossiers/{dossierId}/fils")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<FilResponse>> getFilsParCategorie(
            @PathVariable String userName,
            @PathVariable Long dossierId,
            @RequestParam Categorie categorie) {

        List<Fil> fils = filRepository.findByDossierIdAndCategorie(dossierId, categorie);

        // Si la liste est vide, on pourrait même renvoyer un "204 No Content" si on voulait
        if (fils.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<FilResponse> response = fils.stream().map(f -> {
            Message lastMsg = f.getDernierMessage();
            return new FilResponse(
                    f.getId(), f.getTitre(), f.getCategorie(), f.getDatedecreation(),
                    lastMsg != null ? lastMsg.getContenu() : "Aucun message",
                    lastMsg != null ? lastMsg.getAuteurNom() : ""
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }


}