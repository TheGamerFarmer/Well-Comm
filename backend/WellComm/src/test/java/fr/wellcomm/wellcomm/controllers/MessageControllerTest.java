package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Category;
import fr.wellcomm.wellcomm.domain.Role;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.repositories.*;
import fr.wellcomm.wellcomm.services.MessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import tools.jackson.databind.ObjectMapper;
import java.util.Date;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class MessageControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private WebApplicationContext context;
    @Autowired
    private RecordRepository recordRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ChannelRepository channelRepository;
    @Autowired
    private RecordAccountRepository recordAccountRepository;
    @SuppressWarnings("unused")
    @Autowired
    private ObjectMapper objectMapper;
    @SuppressWarnings("unused")
    @MockitoBean
    private MessageService messageService;
    @Autowired
    private MessageRepository messageRepository;

    @BeforeEach
    void setup() {
        // Pour tester la sécurité @PreAuthorize, on doit appliquer springSecurity()
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    void testmodifyMessage() throws Exception {
        // 1. Création des données
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        record = recordRepository.save(record);

        RecordAccount ra = new RecordAccount(userTest, record, Role.AIDANT);
        recordAccountRepository.save(ra);

        Date date = new Date();
        OpenChannel openChannel = new OpenChannel("nourriture", date, Category.Menage, record);
        channelRepository.save(openChannel);

        // 2. Mock du comportement métier uniquement
        Message mockMsg = new Message("Hello",
                new Date(),
                userTest,
                "ADMIN",
                openChannel, false);

        // 3. Configuration du Mock pour retourner ce message
        when(messageService.getMessage(anyLong())).thenReturn(mockMsg);
        // 4. Exécution
        mockMvc.perform(put("/api/" + userTest.getId() + "/records/" + record.getId() + "/channels/" + openChannel.getId() + "/messages/" + mockMsg.getId())
                        .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("Tentative"))
                .andExpect(status().isOk());

        verify(messageService).modifyContent(any(Message.class), eq("Tentative"));
    }


    @Test
    void testdeleteMessage() throws Exception {
        // 1. Création des données
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        record = recordRepository.save(record);

        RecordAccount ra = new RecordAccount(userTest, record, Role.AIDANT);
        recordAccountRepository.save(ra);

        Date date = new Date();
        OpenChannel openChannel = new OpenChannel("nourriture", date, Category.Menage, record);
        channelRepository.save(openChannel);

        // 2. Mock du comportement métier uniquement
        Message mockMsg = new Message("Hello",
                new Date(),
                userTest,
                "ADMIN",
                openChannel, false);
        messageRepository.save(mockMsg);

        // 3. Configuration du Mock pour retourner ce message
        when(messageService.getMessage(anyLong())).thenReturn(mockMsg);
        // 4. Exécution
        mockMvc.perform(delete("/api/" + userTest.getId() + "/records/" + record.getId() + "/channels/" + openChannel.getId() + "/messages/" + mockMsg.getId())
                        .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString())))
                .andExpect(status().isOk());

        verify(messageService).deleteMessage(any(Message.class));
    }
}