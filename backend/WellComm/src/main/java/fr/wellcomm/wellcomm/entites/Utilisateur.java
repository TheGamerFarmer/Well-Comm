package fr.wellcomm.wellcomm.entites;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "utilisateur")
@Getter
@Setter
@NoArgsConstructor
public class Utilisateur {
    @Id
    private String email; // La clé primaire
    private String nom;
    private String prenom;
    private String password;
}