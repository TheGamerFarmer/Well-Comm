package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Calendar;
import fr.wellcomm.wellcomm.entities.Event;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.CalendarRepository;
import fr.wellcomm.wellcomm.repositories.EventRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CalendarService {
    private final EventRepository eventRepository;
    private final CalendarRepository calendarRepository;

    public Calendar createCalendar(Record record) {
        return calendarRepository.save(new Calendar(record));
    }

    public List<Event> getEventsByRange(@NotNull Calendar calendar, LocalDateTime startView, LocalDateTime endView) {
        return eventRepository.findByCalendarIdAndTimeStartBeforeAndTimeEndAfter(
                calendar.getId(), endView, startView);
    }

    public void deleteEvent(@NotNull Event event) {
        Calendar calendar = event.getCalendar();
        calendar.getEvents().remove(event.getId());
        calendarRepository.save(calendar);
        eventRepository.deleteById(event.getId());
    }
}