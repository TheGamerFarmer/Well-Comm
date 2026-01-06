package fr.wellcomm.wellcomm.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @ManyToOne
    @JoinColumn(name = "fil_id") // C'est ici que le filId sera créé en base de données
    @JsonIgnore // Indispensable pour éviter la boucle infinie JSON
    private Fil fil;

    public Message(String contenu, String auteurNom, String auteurRole) {
        this.contenu = contenu;
        this.auteurNom = auteurNom;
        this.auteurRole = auteurRole;
        this.dateEnvoi = new Date();
        this.fil = fil;
    }

}