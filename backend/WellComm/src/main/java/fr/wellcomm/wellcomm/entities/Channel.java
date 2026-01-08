package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

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
}
