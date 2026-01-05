package entités;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
public class Fil {

    @Id
    private Long id;

    private String titre;
    private Date datedecreation;
    private Categorie categorie;
    //private List<Message> messages = new ArrayList<>();

}
