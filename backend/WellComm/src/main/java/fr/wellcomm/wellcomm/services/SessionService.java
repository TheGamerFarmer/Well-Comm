package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.repositories.SessionRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@AllArgsConstructor
public class SessionService {
    private final SessionRepository sessionRepository;
}
