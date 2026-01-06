package fr.wellcomm.wellcomm.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Dossier")
@Getter
@Setter
@NoArgsConstructor
public class Dossier {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    private String nom;

    //Relation vers Fil (Un dossier a plusieurs fils)
    @OneToMany
    private List<Fil> fils = new ArrayList<>();
    //Relation vers CompteParDossier (Un dossier a plusieurs comptesParDossier)
    @OneToMany
    private List<CompteParDossier> comptesParDossier = new ArrayList<>();
    //private Historique historique;

    public Dossier(String nom) {
        this.nom = nom;
    }

    public void creerFil(String titre, Categorie categorie) {
        Fil fil = new Fil(titre, new Date(), categorie);
        fils.add(fil);
    }

    /*public void archiverFil(Fil fil) {
        fil.remove(fil);
        historique.historique.add(Fil);
    }*/

    public void addCompteParDossier(CompteParDossier compte) {
        comptesParDossier.add(compte);
    }

    public void supprimerCompteParDossier(CompteParDossier compte) {
        comptesParDossier.remove(compte);
    }
}
