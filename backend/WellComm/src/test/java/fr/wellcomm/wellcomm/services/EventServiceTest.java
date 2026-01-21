package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Event;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.EventRepository;
import fr.wellcomm.wellcomm.repositories.RecordRepository;
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
    @Autowired private RecordService recordService;

    @Test
    void testEvent() {
        Account user = new Account();
        user.setUserName("testUser");
        Record testRecord = recordService.createRecord("Dossier Global", "userTest");
        //test createEvent
        LocalDateTime now = LocalDateTime.now();
        Event testevent = eventService.createEvent(testRecord.getCalendar().getId(), "titre", "descritpion", now.plusHours(1), now.plusHours(3), "ici","bleue");
        // Test getEvent
        Event event2 = eventService.getEvent(testevent.getId());
        assertEquals(testevent.getTitle(), event2.getTitle());
    }
}