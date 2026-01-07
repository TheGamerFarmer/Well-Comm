package fr.wellcomm.wellcomm.entities;

import fr.wellcomm.wellcomm.domain.Agenda;
import fr.wellcomm.wellcomm.domain.Historique;
import fr.wellcomm.wellcomm.domain.Resume;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
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
    @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Fil> fils = new ArrayList<>();
    //Relation vers CompteParDossier (Un dossier a plusieurs comptesParDossier)
    @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CompteParDossier> comptesParDossier = new ArrayList<>();
    @Transient
    private Historique historique;
    @Transient
    private Agenda agenda;
    @Transient
    private Resume resume;

    public Dossier(String nom) {
        this.nom = nom;
        this.historique = new Historique();
        this.agenda = new Agenda();
        this.resume = new Resume();
    }
}
