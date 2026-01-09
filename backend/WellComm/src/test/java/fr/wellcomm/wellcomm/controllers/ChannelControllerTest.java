package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.repositories.RecordRepository;
import fr.wellcomm.wellcomm.services.ChannelService;
import fr.wellcomm.wellcomm.domain.Permission;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.Date;
import java.util.List;

@SpringBootTest
@Transactional
public class ChannelControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RecordAccountRepository recordAccountRepository;

    @MockitoBean
    private ChannelService channelService;

    public ChannelControllerTest(ChannelService channelService) {
        this.channelService = channelService;
    }

    @BeforeEach
    void setup() {
        // Pour tester la sécurité @PreAuthorize, on doit appliquer springSecurity()
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    @WithMockUser(username = "userTest")
    void testRealPermissionSuccess() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        accountRepository.save(userTest);

        Record record = new Record("Dossier Médical");
        recordRepository.save(record);

        // Ajout de la permission SEND_MESSAGE
        List<Permission> permissions = List.of(Permission.SEND_MESSAGE);
        RecordAccount ra = new RecordAccount(userTest, record, "ADMIN", permissions);
        recordAccountRepository.save(ra);

        // 2. Mock du comportement métier uniquement
        OpenChannel mockChan = new OpenChannel();
        mockChan.setRecord(record);
        mockChan.setId(1L);

        Message mockMsg = new Message("Hello",
                new Date(),
                new Account(),
                "ADMIN",
                mockChan);

        // 2. Configuration du Mock pour retourner ce message
        when(channelService.getChannel(anyLong())).thenReturn(mockChan);
        when(channelService.addMessage(any(), any(), any())).thenReturn(mockMsg);

        // 3. Exécution
        mockMvc.perform(post("/api/userTest/records/" + record.getId() + "/channels/1/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("Hello"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "userTest")
    void testRealPermissionDenied() throws Exception {
        // 1. Création des données SANS la permission SEND_MESSAGE
        Account userTest = new Account();
        userTest.setUserName("userTest");
        accountRepository.save(userTest);

        Record record = new Record("Dossier Secret");
        recordRepository.save(record);

        // On donne une autre permission, mais pas SEND_MESSAGE
        List<Permission> permissions = List.of(Permission.IsMedecin);
        RecordAccount ra = new RecordAccount(userTest, record, "LECTEUR", permissions);
        recordAccountRepository.save(ra);

        OpenChannel mockChan = new OpenChannel();
        mockChan.setRecord(record);
        when(channelService.getChannel(anyLong())).thenReturn(mockChan);

        // 2. Exécution : Doit être bloqué (403 Forbidden)
        mockMvc.perform(post("/api/userTest/records/" + record.getId() + "/channels/1/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("Tentative"))
                .andExpect(status().isForbidden());
    }
}