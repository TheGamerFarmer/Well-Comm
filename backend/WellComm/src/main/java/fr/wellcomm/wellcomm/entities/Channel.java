package fr.wellcomm.wellcomm.entities;

import fr.wellcomm.wellcomm.domain.Category;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Comparator;
import java.util.Date;
import java.util.Map;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
public abstract class Channel {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    protected long id;
    protected String title;
    protected Date creationDate;
    protected Category category;
    @ManyToOne
    @JoinColumn(name = "record_id")
    protected Record record;
    @OneToMany(mappedBy = "channel", cascade = CascadeType.ALL)
    protected Map<Long, Message> messages;

    public Message getLastMessage() {
        return messages.values()
                .stream()
                .max(Comparator.comparingLong(message -> message.getDate().getTime()))
                .orElse(null);
    }
}
