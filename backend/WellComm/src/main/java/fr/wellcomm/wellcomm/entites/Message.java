package fr.wellcomm.wellcomm.entites;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Message {
    @Id
    private long id = 0;

    private String contenu = "";
}