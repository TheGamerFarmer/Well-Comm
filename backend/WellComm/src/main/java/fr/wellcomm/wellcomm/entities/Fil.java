package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "Fil")
@Getter
@Setter
@NoArgsConstructor
public class Fil {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    private String titre;
    private Date datedecreation;
    private Categorie categorie;
    @OneToMany(mappedBy = "fil", cascade = CascadeType.ALL)
    private List<Message> messages = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "dossier_id")
    private Dossier dossier;

    public Fil(String titre, Date datedecreation, Categorie categorie, Dossier dossier) {
        this.titre = titre;
        this.datedecreation = datedecreation;
        this.categorie = categorie;
        this.dossier = dossier;
    }

    public void envoyerMessage(Message message) {
        messages.add(message);
    }

    public void supprimerMessage(Message message) {
        messages.remove(message);
    }

    @Transient
    public Message getDernierMessage() {
        if (messages == null || messages.isEmpty()) {
            return null;
        }
        // On récupère le message envoyé
        return messages.getLast();
    }
}
