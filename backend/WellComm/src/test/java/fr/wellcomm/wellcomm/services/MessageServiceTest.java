package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.domain.Category;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class MessageServiceTest {
    @Autowired private AccountService accountService;
    @Autowired private MessageService messageService;
    @Autowired private RecordService recordService;
    private Message testMessage;
    private OpenChannel testChannel;

    @BeforeEach
    void setUp() {
        // 1. Créer un Record pour l'arborescence
        Record record = recordService.createRecord("Dossier de Test");

        // 2. Créer un Channel
        testChannel = recordService.createChannel(record, "Canal Test", Category.Sante, "Premier message", accountService.getUser("testUser"));

        // 3. Récupérer le message créé par createChannel
        testMessage = testChannel.getLastMessage();
    }

    @Test
    void testModifyContent() {
        String newContent = "Contenu mis à jour";
        messageService.modifyContent(testMessage, newContent); //

        Message updated = messageService.getMessage(testMessage.getId()); //
        assertEquals(newContent, updated.getContent());
    }

    @Test
    void testGetNbMessage() {
        long count = messageService.getNbMessage(testChannel.getId()); //
        assertEquals(1, count, "Le canal devrait avoir exactement 1 message initial");
    }

    @Test
    void testDeleteMessage() {
        messageService.deleteMessage(testMessage); //
        assertNull(messageService.getMessage(testMessage.getId())); //
    }
}