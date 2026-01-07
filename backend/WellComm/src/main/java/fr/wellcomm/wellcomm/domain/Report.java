package fr.wellcomm.wellcomm.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
public class Report {
    private ArrayList<String> report = new ArrayList<>();
}
