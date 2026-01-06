package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Message")
@Getter
@Setter
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String contenu;

    public Message(String contenu) {
        this.contenu = contenu;
    }
    public Message() {

    }

    public void modifierContenu(String contenu) {
        this.contenu = contenu;
    }
}