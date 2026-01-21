package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Event;
import fr.wellcomm.wellcomm.entities.Record;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class CalendarServiceTest {
    @Autowired private EventService eventService;
    @Autowired private CalendarService calendarService;
    @Autowired private RecordService recordService;

    @Test
    void testCalendar() {
        Account user = new Account();
        user.setUserName("testUser");
        Record testRecord = recordService.createRecord("Dossier Global", 1L);

        LocalDateTime now = LocalDateTime.now();
        Event testevent = eventService.createEvent(testRecord.getCalendar().getId(), "titre", "descritpion", now.plusHours(1), now.plusHours(3), "ici","bleue");

        //test getEventsByRange
        List<Event> events = calendarService.getEventsByRange(testRecord.getCalendar(), now.minusDays(1), now.plusDays(2));
        assertEquals(1, events.size());

        //test deleteEvent
        calendarService.deleteEvent(testevent);
        List<Event> events2 = calendarService.getEventsByRange(testRecord.getCalendar(), now.minusDays(1), now.plusDays(2));
        assertEquals(0, events2.size());
    }
}