package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.domain.Category;
import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.Comparator;
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
        Record record = recordService.createRecord("Dossier", user.getId());
        List<Permission> permissionList = new ArrayList<>();
        permissionList.add(Permission.ASSIGN_PERMISSIONS);
        accountService.addRecordAccount(user, new RecordAccount(user, record, "AIDANT",permissionList));
        OpenChannel channel = recordService.createChannel(record, "Mal de dos", Category.Sante, "il a mal au dos", user);

        // 1. Test addMessage
        Message newMessage = channelService.addMessage(channel, "probleme regle", user);
        assertNotNull(newMessage);
        assertEquals("AIDANT", newMessage.getAuthorTitle());

        // 2. Test getLastMessage
        Message last = channel.getLastMessage();
        assertEquals("probleme regle", last.getContent());
    }

    @Test
    void testMessageOrder() throws InterruptedException {
        // 1. Setup : Créer un dossier et un canal
        Account user = new Account();
        user.setUserName("testOrder");
        accountService.saveUser(user);

        Record record = recordService.createRecord("Dossier Ordre", user.getId());
        List<Permission> permissionList = new ArrayList<>();
        permissionList.add(Permission.ASSIGN_PERMISSIONS);
        accountService.addRecordAccount(user, new RecordAccount(user, record, "ADMIN",permissionList));

        // Le premier message est créé ici (Message Index 0)
        OpenChannel channel = recordService.createChannel(record, "Discussion", Category.Sante, "Premier !", user);

        // 2. Ajouter d'autres messages avec un petit délai pour garantir l'ordre des dates
        Thread.sleep(10);
        channelService.addMessage(channel, "Second message", user);

        Thread.sleep(10);
        channelService.addMessage(channel, "Troisième message", user);

        OpenChannel updatedChannel = channelService.getChannel(channel.getId());

        // 3. Récupérer les messages du canal
        List<Message> sortedMessages = updatedChannel.getMessages().values().stream()
                .sorted(Comparator.comparing(Message::getDate))
                .toList();


        // 4. Vérifications
        assertEquals(3, sortedMessages.size(), "Il devrait y avoir 3 messages au total");

        // Vérification de l'ordre chronologique (L'index le plus bas est le plus ancien)
        assertEquals("Premier !", sortedMessages.get(0).getContent());
        assertEquals("Second message", sortedMessages.get(1).getContent());
        assertEquals("Troisième message", sortedMessages.get(2).getContent());

        // Vérification stricte des dates
        assertTrue(sortedMessages.get(0).getDate().before(sortedMessages.get(1).getDate()));
        assertTrue(sortedMessages.get(1).getDate().before(sortedMessages.get(2).getDate()));
    }
}