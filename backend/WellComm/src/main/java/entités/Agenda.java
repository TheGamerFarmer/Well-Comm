package entités;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class Agenda {
    ArrayList<Evenement> agenda = new ArrayList<>();
}
