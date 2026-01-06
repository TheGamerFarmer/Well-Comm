package fr.wellcomm.wellcomm.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Entity
@Table(name = "Fil")
@Getter
@Setter
public class Fil {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id = 0;

    private String titre = "titre";
    private Date datedecreation = new Date();
    private Categorie categorie = Categorie.Sante;
    //private List<Message> messages = new ArrayList<>();

}
