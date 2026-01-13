package fr.wellcomm.wellcomm.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EventDTO {
    private String title;  // Le nom de l'événement
    private String start;  // La date de début (au format ISO 8601 pour JS)
    private String end;    // La date de fin
}