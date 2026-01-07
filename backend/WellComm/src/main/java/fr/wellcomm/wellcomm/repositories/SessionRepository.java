package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Session;
import fr.wellcomm.wellcomm.entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {
    void deleteByUser(Utilisateur user);
    void deleteByDateExpirationBefore(LocalDateTime now);
}