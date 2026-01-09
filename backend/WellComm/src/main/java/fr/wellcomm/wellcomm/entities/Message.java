package fr.wellcomm.wellcomm.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "message")
@Getter
@Setter
@NoArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String content;
    private Date date;
    @ManyToOne
    @JoinColumn(name = "author_username")
    private Account author;
    private String authorTitle;
    @ManyToOne
    @JoinColumn(name = "channel_id", nullable = false)
    @JsonIgnore // Indispensable pour éviter la boucle infinie JSON
    private Channel channel;

    public Message(String content, Date date, Account author, String authorTitle, Channel channel) {
        this.content = content;
        this.date = date;
        this.author = author;
        this.authorTitle = authorTitle;
        this.channel = channel;
    }
}