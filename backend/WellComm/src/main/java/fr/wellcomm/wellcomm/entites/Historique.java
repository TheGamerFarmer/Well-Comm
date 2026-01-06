package fr.wellcomm.wellcomm.entites;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
public class Historique {
    ArrayList<Fil> historique = new ArrayList<>();

    public void supprimerFil(Fil fil){
        historique.remove(fil);
    }
}
