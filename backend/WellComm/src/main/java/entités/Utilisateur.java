package entités;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Utilisateur {

    private String nom;
    private String prenom;

    @Id
    private String email;
    private String password;
}
