package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {
    void deleteByAccount(Account account);
    void deleteByExpirationDateBefore(LocalDateTime now);
    Session findByAccount(Account account);
}