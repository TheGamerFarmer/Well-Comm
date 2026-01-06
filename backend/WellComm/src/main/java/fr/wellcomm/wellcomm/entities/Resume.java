package fr.wellcomm.wellcomm.entities;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class Resume {
    private ArrayList<String> resume = new ArrayList<>();

    public Resume() {}
}
