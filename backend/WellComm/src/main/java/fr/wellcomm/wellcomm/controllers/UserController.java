package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Utilisateur;
import fr.wellcomm.wellcomm.services.UtilisateurService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/{userName}")
@AllArgsConstructor
public class UserController {
    public final UtilisateurService utilisateurService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class UserInfos {
        private String firstName;
        private String lastName;
    }

    @GetMapping("/infos")
    @PreAuthorize("#userName == authentication.name")
    public UserInfos getInfos(@PathVariable String userName) {
        Utilisateur user = utilisateurService.getUtilisateur(userName);

        return new UserInfos(user.getPrenom(),
                user.getNom());
    }

    @GetMapping("/changePassword/{oldPassword}/{newPassword}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> checkPassword(@PathVariable String userName, @PathVariable String oldPassword, @PathVariable String newPassword) {
        Utilisateur user = utilisateurService.getUtilisateur(userName);

        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));

            utilisateurService.saveUser(user);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).body("Mot de passe incorrect");
        }
    }

    @GetMapping("/deleteUser")
    @PreAuthorize("#userName == authentication.name")
    public void deleteUser(@PathVariable String userName) {
        utilisateurService.deleteUtilisateur(userName);
    }
}
