package fr.wellcomm.wellcomm.domain;

import fr.wellcomm.wellcomm.entities.Fil;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
public class Historique {
    ArrayList<Fil> historique = new ArrayList<>();

    public void addFil(Fil fil) {
        historique.add(fil);
    }

    public void supprimerFil(Fil fil){
        historique.remove(fil);
    }
}
