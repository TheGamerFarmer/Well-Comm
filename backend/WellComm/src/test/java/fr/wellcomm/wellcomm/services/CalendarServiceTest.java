package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Event;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.repositories.EventRepository;
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
    @Autowired
    private CalendarService calendarService;
    @Autowired
    private RecordService recordService;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private AccountRepository accountRepository;

    @Test
    void testCalendar() {
        Account user = new Account();
        user.setUserName("testUser");
        user = accountRepository.save(user);
        Record testRecord = recordService.createRecord("Dossier Global", user);

        LocalDateTime now = LocalDateTime.now();
        Event testEvent = new Event(testRecord.getCalendar(),
                "titre",
                now.plusHours(1),
                now.plusHours(3),
                "descritpion",
                "ici",
                "bleue");

        testEvent = eventRepository.save(testEvent);

        List<Event> events = calendarService.getEventsByRange(testRecord.getCalendar(), now.minusDays(1), now.plusDays(2));
        assertEquals(1, events.size());

        calendarService.deleteEvent(testEvent);
        List<Event> events2 = calendarService.getEventsByRange(testRecord.getCalendar(), now.minusDays(1), now.plusDays(2));
        assertEquals(0, events2.size());
    }
}