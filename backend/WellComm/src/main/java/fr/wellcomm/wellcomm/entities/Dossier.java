package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Dossier")
@Getter
@Setter
public class Dossier {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    private String nom;

    @OneToMany
    private List<Fil> fils = new ArrayList<>();
    //private Historique historique;

    public Dossier(String nom) {
        this.nom = nom;
    }

    public Dossier() {}

    public void creerFil(String titre, Categorie categorie) {
        Fil fil = new Fil(titre, new Date(), categorie);
        fils.add(fil);
    }

    /*public void archiverFil(Fil fil) {
        fil.remove(fil);
        historique.historique.add(Fil);
    }*/
}
