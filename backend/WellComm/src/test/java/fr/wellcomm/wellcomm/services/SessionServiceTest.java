package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Session;
import fr.wellcomm.wellcomm.repositories.EventRepository;
import fr.wellcomm.wellcomm.repositories.RecordRepository;
import fr.wellcomm.wellcomm.repositories.SessionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class SessionServiceTest {
    @Autowired private SessionService sessionService;
    @Autowired private SessionRepository sessionRepository;

    @Test
    void testSession() {
        Account user = new Account();
        user.setUserName("testUser");

        Session session = new Session();
        session.setAccount(user);
        assertNotNull(session);

        sessionService.logout(user);
        Session session2 = sessionRepository.findByAccount(user);
        assertNull(session2);
    }
}