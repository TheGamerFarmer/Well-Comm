package fr.wellcomm.wellcomm.entites;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.*;

@Getter
@Setter
@RestController
@RequestMapping("api/login")
public class Utilisateur {
    private String nom = "Raphael";
    private String prenom = "Matheret";

    @Id
    private String email = "raphael";
    private String password = "test";

    @GetMapping("/email")
    public String email() {
        return email;
    }

    @GetMapping("/{email}/{password}")
    public boolean tryConnection(@PathVariable String email, @PathVariable String password) {
        return this.email.equals(email) && this.password.equals(password);
    }
}
