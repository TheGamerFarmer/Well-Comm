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
    private String authorName;
    private String authorRole;
    @ManyToOne
    @JoinColumn(name = "channel_id", nullable = false)
    @JsonIgnore // Indispensable pour éviter la boucle infinie JSON
    private Channel channel;

    public Message(String content, Date date, String authorName, String authorRole, Channel channel) {
        this.content = content;
        this.date = date;
        this.authorName = authorName;
        this.authorRole = authorRole;
        this.channel = channel;
    }
}