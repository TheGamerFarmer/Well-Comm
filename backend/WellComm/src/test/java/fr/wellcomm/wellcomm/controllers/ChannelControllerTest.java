package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Category;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.repositories.ChannelRepository;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.repositories.RecordRepository;
import fr.wellcomm.wellcomm.services.ChannelService;
import fr.wellcomm.wellcomm.domain.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import tools.jackson.databind.ObjectMapper;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.Date;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class ChannelControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private WebApplicationContext context;
    @Autowired
    private RecordRepository recordRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private RecordAccountRepository recordAccountRepository;
    @Autowired
    private ObjectMapper objectMapper;
    @SuppressWarnings("unused")
    @MockitoBean
    private ChannelService channelService;
    @Autowired
    private ChannelRepository channelRepository;

    @BeforeEach
    void setup() {
        // Pour tester la sécurité @PreAuthorize, on doit appliquer springSecurity()
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    void testRealPermissionSuccess() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Médical", userTest.getId());
        record = recordRepository.save(record);

        RecordAccount ra = new RecordAccount(userTest, record, Role.AIDANT);
        recordAccountRepository.save(ra);

        // 2. Mock du comportement métier uniquement
        OpenChannel mockChan = new OpenChannel();
        mockChan.setRecord(record);
        mockChan = channelRepository.save(mockChan);

        Message mockMsg = new Message("Hello",
                new Date(),
                new Account(),
                "ADMIN",
                mockChan, false);

        // 2. Configuration du Mock pour retourner ce message
        when(channelService.getChannel(anyLong())).thenReturn(mockChan);
        when(channelService.addMessage(any(), any(), any())).thenReturn(mockMsg);

        // 3. Exécution
        mockMvc.perform(post("/api/" + userTest.getId() + "/records/" + record.getId() + "/channels/" + mockChan.getId() + "/messages")
                        .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mockMsg.getContent()))
                .andExpect(status().isOk());
    }

    @Test
    void testRealPermissionDenied() throws Exception {
        // 1. Création des données SANS la permission SEND_MESSAGE
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", 0L);
        record = recordRepository.save(record);

        RecordAccount ra = new RecordAccount(userTest, record, Role.MEDECIN);
        recordAccountRepository.save(ra);

        OpenChannel mockChan = new OpenChannel();
        mockChan.setRecord(record);
        when(channelService.getChannel(anyLong())).thenReturn(mockChan);

        // 2. Exécution : Doit être bloqué (403 Forbidden)
        mockMvc.perform(post("/api/0/records/" + record.getId() + "/channels/1/messages")
                        .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("Tentative"))
                .andExpect(status().isForbidden());
    }


    @Test
    void testgetChannelContent() throws Exception {
        // 1. Création des données
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest.getId());
        record = recordRepository.save(record);

        RecordAccount ra = new RecordAccount(userTest, record, Role.MEDECIN);
        recordAccountRepository.save(ra);

        OpenChannel mockChan = new OpenChannel();
        mockChan.setRecord(record);
        mockChan.setCategory(Category.Menage);
        mockChan = channelRepository.save(mockChan);

        when(channelService.getChannel(anyLong())).thenReturn(mockChan);

        // 2. Exécution
        MvcResult result = mockMvc.perform(get("/api/" + userTest.getId() + "/records/" + record.getId() + "/channels/" + mockChan.getId())
                        .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn();

        String json = result.getResponse().getContentAsString();

        ChannelController.ChannelInfos infos = objectMapper.readValue(
                json,
                ChannelController.ChannelInfos.class
        );

        //Vérifie qu'il n'y a aucun message
        assertEquals(0, infos.getMessages().size());
    }


    @Test
    void testgetCloseChannelContent() throws Exception {
        // 1. Création des données
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest.getId());
        record = recordRepository.save(record);

        RecordAccount ra = new RecordAccount(userTest, record, Role.MEDECIN);
        recordAccountRepository.save(ra);

        CloseChannel mockChan = new CloseChannel();
        mockChan.setRecord(record);
        mockChan.setCategory(Category.Menage);
        when(channelService.getCloseChannel(anyLong())).thenReturn(mockChan);

        // 2. Exécution
        MvcResult result = mockMvc.perform(get("/api/" + userTest.getId() + "/records/" + record.getId() + "/closechannels/" + mockChan.getId())
                        .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn();

        String json = result.getResponse().getContentAsString();

        ChannelController.ChannelInfos infos = objectMapper.readValue(
                json,
                ChannelController.ChannelInfos.class
        );

        //Vérifie qu'il n'y a aucun message
        assertEquals(0, infos.getMessages().size());
    }

    @Test
    void testaddMessage() throws Exception {
        // 1. Création des données
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest.getId());
        record = recordRepository.save(record);
        System.out.println(record.getId());

        RecordAccount ra = new RecordAccount(userTest, record, Role.AIDANT);
        recordAccountRepository.save(ra);

        // 2. Mock du comportement métier uniquement
        OpenChannel mockChan = new OpenChannel();
        mockChan.setRecord(record);

        Message mockMsg = new Message("Hello",
                new Date(),
                new Account(),
                "ADMIN",
                mockChan, false);

        // 3. Configuration du Mock pour retourner ce message
        when(channelService.getChannel(anyLong())).thenReturn(mockChan);
        when(channelService.addMessage(any(), any(), any())).thenReturn(mockMsg);
        // 4. Exécution
        MvcResult result = mockMvc.perform(post("/api/" + userTest.getId() + "/records/" + record.getId() + "/channels/" + mockChan.getId() + "/messages")
                        .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mockMsg.getContent()))
                .andExpect(status().isOk()).andReturn();

        String json = result.getResponse().getContentAsString();

        ChannelController.MessageInfos infos = objectMapper.readValue(
                json,
                ChannelController.MessageInfos.class
        );

        assertEquals("Hello", infos.getContent());
    }
}