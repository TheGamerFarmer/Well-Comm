package fr.wellcomm.wellcomm.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class Agenda {
    ArrayList<Evenement> agenda = new ArrayList<>();

    public void addEvenement(String titre, String lieu, Date date, Date horairedebut, Date horairefin){
        Evenement evenement = new Evenement(titre, lieu, date, horairedebut, horairefin);
        agenda.add(evenement);
    }

    public void supprimerEvenement(Evenement evenement){
        agenda.remove(evenement);
    }

}
