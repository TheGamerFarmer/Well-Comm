package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Event;
import fr.wellcomm.wellcomm.repositories.EventRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;

    public Event getEvent(long id) {
        return eventRepository.findById(id).orElse(null);
    }
}
