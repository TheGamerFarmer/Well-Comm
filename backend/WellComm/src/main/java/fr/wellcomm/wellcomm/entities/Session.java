package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Session {
    @Id
    private String token;
    private String userName;
    private LocalDateTime dateExpiration;
}