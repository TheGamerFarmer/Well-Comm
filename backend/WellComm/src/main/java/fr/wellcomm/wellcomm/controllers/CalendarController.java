package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Calendar;
import fr.wellcomm.wellcomm.entities.Event;
import fr.wellcomm.wellcomm.repositories.CalendarRepository;
import fr.wellcomm.wellcomm.repositories.EventRepository;
import fr.wellcomm.wellcomm.services.CalendarService;
import fr.wellcomm.wellcomm.services.EventService;
import fr.wellcomm.wellcomm.services.RecordService;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.awt.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/{userName}/records/{recordId}/calendar")
@AllArgsConstructor
public class CalendarController {
    private final RecordService recordService;
    private final CalendarService calendarService;
    private final EventService eventService;
    private final EventRepository eventRepository;
    private final CalendarRepository calendarRepository;

    public record EventDTO(
            Long id,
            String title,
            String start, // Format ISO String pour FullCalendar
            String end,
            String description,
            String location,
            String color
    ) {}

    private @NotNull EventDTO mapToDTO(@NotNull Event e) {
        return new EventDTO(e.getId(),
                e.getTitle(),
                e.getTimeStart().toString(),
                e.getTimeEnd().toString(),
                e.getDescription(),
                e.getLocation(),
                e.getColor().toString());
    }

    private void mapToEntity(@NotNull EventDTO dto, @NotNull Event e) {
        e.setTitle(dto.title());
        e.setTimeStart(LocalDateTime.parse(dto.start()));
        e.setTimeEnd(LocalDateTime.parse(dto.end()));
        e.setDescription(dto.description());
        e.setLocation(dto.location());
        e.setColor(Color.decode(dto.color()));
    }

    @GetMapping("/startDate/{timeStart}/endDate/{timeEnd}")
    @PreAuthorize("#userName == authentication.name")
            //"@securityService.hasRecordPermission(T(fr.wellcomm.wellcomm.domain.Permission).SEE_CALENDAR)")
    public ResponseEntity<List<EventDTO>> getCalendarContent(@PathVariable @SuppressWarnings("unused") String userName,
                                                             @PathVariable long recordId,
                                                             @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime timeStart,
                                                             @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime timeEnd) {
        Calendar calendar = recordService.getRecord(recordId).getCalendar();
        return ResponseEntity.ok(calendarService.getEventsByRange(calendar, timeStart, timeEnd)
                .stream()
                .map(this::mapToDTO)
                .toList());
    }

    @PostMapping("/event")
    @PreAuthorize("#userName == authentication.name")
            //"@securityService.hasRecordPermission(T(fr.wellcomm.wellcomm.domain.Permission).MODIFY_CALENDAR)")
    public ResponseEntity<EventDTO> createEvent(@PathVariable @SuppressWarnings("unused") String userName,
                                                @PathVariable long recordId,
                                                @RequestBody EventDTO dto) {
        Calendar calendar = recordService.getRecord(recordId).getCalendar();
        Event event = new Event();

        event.setCalendar(calendar);
        mapToEntity(dto, event);
        eventRepository.save(event);

        calendar.getEvents().put(event.getId(), event);
        calendarRepository.save(calendar);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/event/{eventId}")
    @PreAuthorize("#userName == authentication.name")
            //"@securityService.hasEventPermission(T(fr.wellcomm.wellcomm.domain.Permission).MODIFY_CALENDAR)")
    public ResponseEntity<Void> updateEvent(@PathVariable @SuppressWarnings("unused")  String userName,
                                            @PathVariable @SuppressWarnings("unused") String recordId,
                                            @PathVariable long eventId,
                                            @RequestBody EventDTO dto) {
        Event event = eventService.getEvent(eventId);
        mapToEntity(dto, event);
        eventRepository.save(event);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/event/{eventId}")
    @PreAuthorize("#userName == authentication.name")
            //"@securityService.hasEventPermission(T(fr.wellcomm.wellcomm.domain.Permission).MODIFY_CALENDAR)")
    public ResponseEntity<Void> deleteEvent(@PathVariable @SuppressWarnings("unused") String userName,
                                            @PathVariable @SuppressWarnings("unused") String recordId,
                                            @PathVariable long eventId) {
        calendarService.deleteEvent(eventService.getEvent(eventId));
        return ResponseEntity.ok().build();
    }
}
