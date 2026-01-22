package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCalendarIdAndTimeStartBeforeAndTimeEndAfter(Long calendarId, LocalDateTime endView, LocalDateTime startView);
}