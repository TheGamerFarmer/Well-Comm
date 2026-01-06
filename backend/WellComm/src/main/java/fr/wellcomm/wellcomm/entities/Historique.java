package fr.wellcomm.wellcomm.entities;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Getter
@Setter
public class Historique {
    ArrayList<Fil> historique = new ArrayList<>();

    public Historique() {}

    public void supprimerFil(Fil fil){
        historique.remove(fil);
    }
}
