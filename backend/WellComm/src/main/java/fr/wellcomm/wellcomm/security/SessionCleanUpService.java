package fr.wellcomm.wellcomm.security;

import fr.wellcomm.wellcomm.repositories.SessionRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class SessionCleanUpService {
    private final SessionRepository sessionRepository;

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void removeExpiredSessions() {
        sessionRepository.deleteByExpirationDateBefore(LocalDateTime.now());
        System.out.println("Nettoyage des sessions terminées.");
    }
}