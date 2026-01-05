package fr.wellcomm.wellcomm.entites;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class Evenement {
    @Id
    private long id = 0;

    private String titre = "";
    private String lieu = "";
    private Date date = new Date();
    private Date horairedebut = new Date();
    private Date horairefin = new Date();
}
