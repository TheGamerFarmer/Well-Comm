package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "Message")
@Getter
@Setter
@NoArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String contenu;

    private Date dateEnvoi;

    // Pour simplifier dans un premier temps, on stocke le nom et le rôle en dur.
    // Plus tard, on pourra lier cela à l'entité Utilisateur.
    private String auteurNom;
    private String auteurRole;

    public Message(String contenu, String auteurNom, String auteurRole) {
        this.contenu = contenu;
        this.auteurNom = auteurNom;
        this.auteurRole = auteurRole;
        this.dateEnvoi = new Date();
    }

    public void modifierContenu(String contenu) {
        this.contenu = contenu;
    }
}