package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Utilisateur;
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

    @GetMapping("/email/{userName}")
    public String getEmail(@PathVariable String userName) {
        return repository.findById(userName).map(Utilisateur::getUserName).orElse("");
    }

    @GetMapping("/{email}/{password}")
    public boolean tryConnection(@PathVariable String email, @PathVariable String password) {
        Optional<Utilisateur> user = repository.findById(email);

        return user.map(u -> u.getPassword().equals(password)).orElse(false);
    }
}