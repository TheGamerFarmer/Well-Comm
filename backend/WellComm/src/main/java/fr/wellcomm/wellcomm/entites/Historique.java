package fr.wellcomm.wellcomm.entites;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class Historique {
    ArrayList<Fil> historique = new ArrayList<>();

    public void supprimerFil(Fil fil){
        historique.remove(fil);
    }
}
