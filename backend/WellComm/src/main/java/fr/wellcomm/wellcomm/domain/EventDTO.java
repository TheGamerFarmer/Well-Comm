package fr.wellcomm.wellcomm.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class EventDTO {
    private String title;
    private String start;
    private String end;
    private String location;
    private String description;
    private List<String> attendees;
}