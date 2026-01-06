package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "Evenement")
@Getter
@Setter
public class Evenement {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    private String titre;
    private String lieu;
    private Date date;
    private Date horairedebut;
    private Date horairefin;

    public Evenement(String titre, String lieu, Date date, Date horairedebut, Date horairefin) {
        this.titre = titre;
        this.lieu = lieu;
        this.date = date;
        this.horairedebut = horairedebut;
        this.horairefin = horairefin;
    }

    public Evenement() {

    }
}
