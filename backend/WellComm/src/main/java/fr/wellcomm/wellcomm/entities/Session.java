package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Session {
    @Id
    private String token;
    @ManyToOne
    @JoinColumn(name = "user_name", nullable = false)
    private Account account;
    private LocalDateTime expirationDate;
}