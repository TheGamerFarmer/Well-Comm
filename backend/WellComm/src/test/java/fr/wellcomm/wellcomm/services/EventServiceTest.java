package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Event;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.EventRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class EventServiceTest {
    @Autowired private EventService eventService;
    @Autowired private EventRepository eventRepository;
    @Autowired private RecordService recordService;

    @Test
    void testEvent() {
        Account user = new Account();
        user.setUserName("testUser");
        Record testRecord = recordService.createRecord("Dossier Global", user);

        LocalDateTime now = LocalDateTime.now();
        Event testevent = new Event(testRecord.getCalendar(),
                "titre",
                now.plusHours(1),
                now.plusHours(3),
                "descritpion",
                "ici",
                "bleue");
        testevent = eventRepository.save(testevent);

        Event event2 = eventService.getEvent(testevent.getId());
        assertEquals(testevent.getTitle(), event2.getTitle());
    }
}