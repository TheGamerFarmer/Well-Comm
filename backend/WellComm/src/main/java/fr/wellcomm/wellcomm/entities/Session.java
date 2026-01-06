package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Session {
    @Id
    private String token;
    @ManyToOne
    @JoinColumn(name = "user_name", nullable = false)
    private Utilisateur user;
    private LocalDateTime dateExpiration;
}