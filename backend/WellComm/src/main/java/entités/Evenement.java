package entités;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.Date;

@Entity
public class Evenement {
    @Id
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    private String titre;
    private String lieu;
    private Date date;
    private Date horairedebut;
    private Date horairefin;
}
