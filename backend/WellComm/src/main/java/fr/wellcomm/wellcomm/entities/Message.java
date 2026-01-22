package fr.wellcomm.wellcomm.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "messages")
@Data
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
    @JsonIgnore
    private Channel channel;
    private boolean isDeleted;

    public Message(String content, Date date, Account author, String authorTitle, Channel channel, boolean isDeleted) {
        this.content = content;
        this.date = date;
        this.author = author;
        this.authorTitle = authorTitle;
        this.channel = channel;
        this.isDeleted = isDeleted;
    }
}