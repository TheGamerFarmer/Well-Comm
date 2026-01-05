package fr.wellcomm.wellcomm.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Dossier")
@Getter
@Setter
public class Dossier {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id = 0;

    private String nom = "";

    //private List<Fil> fils = new List<>();
    //private Historique historique;

}
