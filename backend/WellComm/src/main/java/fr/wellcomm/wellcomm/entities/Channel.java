package fr.wellcomm.wellcomm.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import fr.wellcomm.wellcomm.domain.Category;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
public abstract class Channel {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    protected long id;
    protected String title;
    protected Date creationDate;
    @Enumerated(EnumType.STRING)
    protected Category category;
    @ManyToOne
    @JoinColumn(name = "record_id")
    @JsonIgnore
    protected Record record;
    @OneToMany(mappedBy = "channel", cascade = CascadeType.ALL)
    @MapKey(name = "id")
    protected Map<Long, Message> messages = new HashMap<>();

    public Message getLastMessage() {
        if (messages == null || messages.isEmpty()) {
            return null;
        }

        return messages.values()
                .stream()
                .max(Comparator.comparing(Message::getDate))
                .orElse(null);
    }
}
