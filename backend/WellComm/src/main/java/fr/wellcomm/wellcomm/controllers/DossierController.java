package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Categorie;
import fr.wellcomm.wellcomm.entities.Fil;
import fr.wellcomm.wellcomm.entities.Message;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import fr.wellcomm.wellcomm.services.DossierService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/{userName}")
@AllArgsConstructor
public class DossierController {

    private final DossierService dossierService;

    // --- DTOs internes pour la réponse ---

    @Getter @Setter @NoArgsConstructor
    public static class CreateFilRequest {
        private String titre;
        private Categorie categorie;
        private String premierMessage;
    }

    @Getter @Setter @AllArgsConstructor
    public static class DossierResponse {
        private Long id;
        private String nom;
    }

    @Getter @Setter @AllArgsConstructor
    public static class FilResponse {
        private Long id;
        private String titre;
        private Categorie categorie;
        private Date dateCreation;
        private String dernierMessageContenu;
        private String dernierMessageAuteur;
    }

    // --- Endpoints ---

    @GetMapping("/dossiers")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<DossierResponse>> getDossiersAccessibles(@PathVariable String userName) {
        List<DossierResponse> dossiers = dossierService.getDossiersAccessibles(userName).stream()
                .map(d -> new DossierResponse(d.getId(), d.getNom()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dossiers);
    }

    @GetMapping("/dossiers/{dossierId}/fils")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<List<FilResponse>> getFilsParCategorie(
            @PathVariable String userName,
            @PathVariable Long dossierId,
            @RequestParam Categorie categorie) {

        List<FilResponse> response = dossierService.getFilsParCategorie(dossierId, categorie).stream()
                .map(f -> {
                    Message lastMsg = f.getDernierMessage();
                    return new FilResponse(
                            f.getId(), f.getTitre(), f.getCategorie(), f.getDatedecreation(),
                            lastMsg != null ? lastMsg.getContenu() : "Aucun message",
                            lastMsg != null ? lastMsg.getAuteurNom() : ""
                    );
                }).collect(Collectors.toList());

        return response.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(response);
    }

    @PostMapping("/dossiers/{dossierId}/fils/new")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<FilResponse> creerNouvelleTransmission(
            @PathVariable String userName,
            @PathVariable Long dossierId,
            @RequestBody CreateFilRequest request) {

        // Appel au service qui gère la création du fil, du message et récupère le rôle
        Fil nouveauFil = dossierService.creerFil(
                dossierId,
                request.getTitre(),
                request.getCategorie(),
                request.getPremierMessage(),
                userName
        );

        Message lastMsg = nouveauFil.getDernierMessage();

        return ResponseEntity.ok(new FilResponse(
                nouveauFil.getId(),
                nouveauFil.getTitre(),
                nouveauFil.getCategorie(),
                nouveauFil.getDatedecreation(),
                lastMsg != null ? lastMsg.getContenu() : "",
                lastMsg != null ? lastMsg.getAuteurNom() : ""
        ));
    }
}