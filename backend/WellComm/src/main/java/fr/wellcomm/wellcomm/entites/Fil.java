package fr.wellcomm.wellcomm.entites;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class Fil {

    @Id
    private long id = 0;

    private String titre = "titre";
    private Date datedecreation = new Date();
    private Categorie categorie = Categorie.Sante;
    //private List<Message> messages = new ArrayList<>();

}
