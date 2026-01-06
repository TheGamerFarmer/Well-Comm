package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entites.Utilisateur;
import fr.wellcomm.wellcomm.repositories.UtilisateurRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("api/login")
public class UtilisateurController {

    private final UtilisateurRepository repository;

    // Injection du repository via le constructeur
    public UtilisateurController(UtilisateurRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/email/{email}")
    public String getEmail(@PathVariable String email) {
        return repository.findById(email)
                .map(Utilisateur::getEmail)
                .orElse("Utilisateur non trouvé");
    }

    @GetMapping("/{email}/{password}")
    public boolean tryConnection(@PathVariable String email, @PathVariable String password) {
        Optional<Utilisateur> user = repository.findById(email);

        return user.map(u -> u.getPassword().equals(password)).orElse(false);
    }
}