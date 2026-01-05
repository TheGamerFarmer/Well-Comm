package entités;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Message {
    @Id
    private Long id;

    private String contenu;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
