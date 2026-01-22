package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.domain.Category;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.repositories.MessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class MessageServiceTest {
    @Autowired private MessageService messageService;
    @Autowired private RecordService recordService;
    @Autowired private AccountRepository accountRepository;
    private Message testMessage;
    private OpenChannel testChannel;
    @Autowired
    private MessageRepository messageRepository;

    @BeforeEach
    void setUp() {
        Account testUser = new Account();
        testUser.setUserName("testUser");
        testUser = accountRepository.save(testUser);
        // 1. Créer un Record pour l'arborescence
        Record record = recordService.createRecord("Dossier de Test", testUser);

        // 2. Créer un Channel
        testChannel = recordService.createChannel(record, "Canal Test", Category.Sante, "Premier message", testUser);

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
        Message deleted = messageRepository.findById(testMessage.getId()).orElse(null);
        assertNotNull(deleted);
        assertEquals("Ce message a été supprimé\u200B", deleted.getContent()); //
    }
}