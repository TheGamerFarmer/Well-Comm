package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.domain.Category;
import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.domain.Role;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class RecordServiceTest {
    @Autowired private RecordService recordService;
    @Autowired private AccountService accountService;
    private Record testRecord;
    private long userId;

    @BeforeEach
    void setUp() {
        // 1. Création de l'utilisateur
        Account testUser = new Account();
        testUser.setUserName("userTest");
        accountService.saveUser(testUser);
        userId = testUser.getId();

        // 2. Création du Record
        testRecord = recordService.createRecord("Dossier Global", userId);

        // 3. Création de l'accès avec USER + RECORD + TITRE
        List<Permission> permissionList = new ArrayList<>();
        permissionList.add(Permission.ASSIGN_PERMISSIONS);
        RecordAccount access = new RecordAccount(testUser, testRecord, Role.AIDANT,permissionList);

        // 4. On l'ajoute à l'utilisateur
        accountService.addRecordAccount(testUser, access);
    }

    @Test
    void testGetRecordsForUser() {
        // Teste si on retrouve bien le dossier lié à l'utilisateur
        List<Record> records = recordService.getRecords(userId);
        assertFalse(records.isEmpty());
        assertEquals("Dossier Global", records.getFirst().getName());
    }

    @Test
    void testCreateChannel() {
        Account user = new Account();
        user.setUserName("userTest");
        accountService.saveUser(user);
        // Teste la création d'un channel et vérifie si le rôle "ADMIN" est bien récupéré
        OpenChannel channel = recordService.createChannel(
                testRecord,
                "Mal de dos",
                Category.Menage,
                "il a mal au dos",
                user
        );

        assertNotNull(channel);
        assertEquals(1, channel.getMessages().size());

        // Vérification du rôle récupéré dynamiquement via RecordAccount
        Message firstMsg = channel.getMessages().values().stream()
                .findFirst()
                .orElse(null);
        assert firstMsg != null;
        assertEquals("ADMIN", firstMsg.getAuthorTitle());
        assertEquals("il a mal au dos", firstMsg.getContent());
    }

    @Test
    void testGetChannelsOfCategory() {
        // On crée deux canaux de catégories différentes
        Account testUser = new Account();
        testUser.setUserName("testUser");
        recordService.createChannel(testRecord, "Mal de dos", Category.Sante, "Hi", testUser);
        recordService.createChannel(testRecord, "salon", Category.Menage, "Vite", testUser);

        // On teste le filtre par catégorie
        List<OpenChannel> commChannels = recordService.getChannelsOfCategory(testRecord.getId(), Category.Menage);

        assertEquals(1, commChannels.size());
        assertEquals("salon", commChannels.getFirst().getTitle());
    }

    @Test
    void testArchiveChannel() {
        // 1. Création du channel
        Account testUser = new Account();
        testUser.setUserName("testUser");
        OpenChannel channel = recordService.createChannel(testRecord, "A Archiver", Category.Menage, "probleme regle", testUser);
        long channelId = channel.getId();

        // 2. Archivage
        recordService.archiveChannel(testRecord, channelId);

        // 3. Vérifications
        // Le channel ne doit plus être dans les "Open"
        assertFalse(testRecord.getOpenChannels().containsKey(channelId));
        // Il doit être dans les "Close"
        assertEquals(1, testRecord.getCloseChannels().size());
        CloseChannel archived = testRecord.getCloseChannels().values().stream()
                .findFirst()
                .orElseThrow(() -> new AssertionError("Aucun channel archivé trouvé"));
        assertEquals("A Archiver", archived.getTitle());

        // Les messages doivent être présents dans le channel archivé
        assertFalse(archived.getMessages().isEmpty());
        String firstMessageContent = archived.getMessages().values().stream()
                .findFirst()
                .map(Message::getContent)
                .orElse("");

        assertEquals("probleme regle", firstMessageContent);
    }
}