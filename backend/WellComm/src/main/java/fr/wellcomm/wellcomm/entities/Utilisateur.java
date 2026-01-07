package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "utilisateur")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Utilisateur {
    @Id
    private String userName;
    private String nom;
    private String prenom;
    private String password;
    @OneToMany
    private List<Dossier> dossiers = new ArrayList<>();
    @OneToMany
    private List<CompteParDossier> comptesParDossier = new ArrayList<>();

    public Utilisateur(String userName, String nom, String prenom, String password) {
        this.userName = userName;
        this.nom = nom;
        this.prenom = prenom;
        this.password = password;
    }
}