package fr.wellcomm.wellcomm.entites;

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
    private long id = 0;

    private String titre = "";
    private String lieu = "";
    private Date date = new Date();
    private Date horairedebut = new Date();
    private Date horairefin = new Date();
}
