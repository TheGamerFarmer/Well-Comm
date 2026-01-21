package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Calendar;
import fr.wellcomm.wellcomm.entities.Event;
import fr.wellcomm.wellcomm.repositories.CalendarRepository;
import fr.wellcomm.wellcomm.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final CalendarRepository calendarRepository;


    public Event createEvent(long id, String title, String description, LocalDateTime timeStart, LocalDateTime timeEnd, String location, String color) {
        Event event = new Event();
        Calendar calendar = calendarRepository.findById(id).get();
        event.setCalendar(calendar);
        event.setTitle(title);
        event.setDescription(description);
        event.setTimeStart(timeStart);
        event.setTimeEnd(timeEnd);
        event.setLocation(location);
        event.setColor(color);
        return eventRepository.save(event);
    }


    public Event getEvent(long id) {
        return eventRepository.findById(id).orElse(null);
    }
}
