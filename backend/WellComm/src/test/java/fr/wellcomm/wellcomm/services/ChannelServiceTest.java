package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ChannelServiceTest {

    @Autowired private ChannelService channelService;
    @Autowired private RecordService recordService;
    @Autowired private AccountService accountService;

    @Test
    void testMessage() {
        // Setup
        Account user = new Account();
        user.setUserName("testUser");
        accountService.saveUser(user);
        Record record = recordService.createRecord("Dossier");
        accountService.addRecordAccount(user, new RecordAccount(user, record, "AIDANT"));
        OpenChannel channel = recordService.createChannel(record, "Mal de dos", Category.Sante, "il a mal au dos", "testUser");

        // 1. Test addMessage
        Message newMessage = channelService.addMessage(channel, "probleme regle", "testUser");
        assertNotNull(newMessage);
        assertEquals("AIDANT", newMessage.getAuthorRole());

        // 2. Test getLastMessage
        Message last = channelService.getLastMessage(channel);
        assertEquals("probleme regle", last.getContent());
    }

    @Test
    void testMessageOrder() throws InterruptedException {
        // 1. Setup : Créer un dossier et un canal
        Account user = new Account();
        user.setUserName("testOrder");
        accountService.saveUser(user);

        Record record = recordService.createRecord("Dossier Ordre");
        accountService.addRecordAccount(user, new RecordAccount(user, record, "ADMIN"));

        // Le premier message est créé ici (Message Index 0)
        OpenChannel channel = recordService.createChannel(record, "Discussion", Category.Sante, "Premier !", "testOrder");

        // 2. Ajouter d'autres messages avec un petit délai pour garantir l'ordre des dates
        Thread.sleep(10);
        channelService.addMessage(channel, "Second message", "testOrder");

        Thread.sleep(10);
        channelService.addMessage(channel, "Troisième message", "testOrder");

        // 3. Récupérer les messages du canal
        List<Message> messages = channel.getMessages();

        // 4. Vérifications
        assertEquals(3, messages.size(), "Il devrait y avoir 3 messages au total");

        // Vérification de l'ordre chronologique (L'index le plus bas est le plus ancien)
        assertEquals("Premier !", messages.get(0).getContent());
        assertEquals("Second message", messages.get(1).getContent());
        assertEquals("Troisième message", messages.get(2).getContent());

        // Vérification stricte des dates
        assertTrue(messages.get(0).getDate().before(messages.get(1).getDate()));
        assertTrue(messages.get(1).getDate().before(messages.get(2).getDate()));
    }
}