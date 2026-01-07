package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "compte_par_dossier")
@Getter
@Setter
@NoArgsConstructor
public class CompteParDossier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relation vers l'utilisateur (Plusieurs accès pour un utilisateur)
    @ManyToOne
    private Utilisateur utilisateur;

    // Relation vers le dossier (Plusieurs utilisateurs pour un dossier)
    @ManyToOne
    private Dossier dossier;


}