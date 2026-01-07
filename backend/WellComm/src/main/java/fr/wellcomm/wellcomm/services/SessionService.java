package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Session;
import fr.wellcomm.wellcomm.repositories.SessionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SessionService {
    private final SessionRepository sessionRepository;

    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
}
