package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Category;
import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.domain.Role;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.repositories.*;
import fr.wellcomm.wellcomm.services.ChannelService;
import fr.wellcomm.wellcomm.services.RecordService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import java.util.Date;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class RecordControllerTest {
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
    @SuppressWarnings("unused")
    @Autowired
    private RecordService recordService;
    @Autowired
    private ChannelRepository channelRepository;
    @Autowired
    private CloseChannelRepository closeChannelRepository;


    @BeforeEach
    void setup() {
        // Pour tester la sécurité @PreAuthorize, on doit appliquer springSecurity()
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    void testgetRecords() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        get("/api/" + userTest.getId() + "/records/")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        List<RecordController.DossierResponse> infos = objectMapper.readValue(
                json,
                List.class
        );

        assertEquals(0, infos.size());
    }

    @Test
    void testgetNameRecord() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        record = recordRepository.save(record);

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        get("/api/" + userTest.getId() + "/records/" + record.getId() + "/name")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String infos = result.getResponse().getContentAsString();

        assertEquals("Dossier Secret", infos);
    }

    @Test
    void testgetChangeNameRecord() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        record = recordRepository.save(record);
        String newname = "dossier secret";

        // 2. Exécution
        mockMvc.perform(
                        put("/api/" + userTest.getId() + "/records/" + record.getId() + "/" + newname)
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        Record r = recordRepository.findById(record.getId()).get();

        assertEquals("dossier secret", r.getName());
    }

    @Test
    void testcreateRecord() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        String name = "dossier secret";

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        post("/api/" + userTest.getId() + "/records/create/" + name)
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        JsonNode root = objectMapper.readTree(json);
        String recordName = root.get("name").asText();

        assertEquals("dossier secret", recordName);
    }

    @Test
    void testgetChannelsFiltered() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        record = recordRepository.save(record);

        Date date = new Date();
        OpenChannel openChannel = new OpenChannel("cuisine", date, Category.Menage, record);
        channelRepository.save(openChannel);
        OpenChannel openChan = new OpenChannel("nourriture", date, Category.Alimentation, record);
        channelRepository.save(openChan);

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        get("/api/" + userTest.getId() + "/records/" + record.getId() + "/channels/categorys/" + Category.Menage)
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        List<RecordController.FilResponse> infos = objectMapper.readValue(
                json,
                List.class
        );

        assertEquals(1, infos.size());
    }

    @Test
    void testgetCloseChannelsFiltered() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        record = recordRepository.save(record);

        ClosedChannel closedChannel = new ClosedChannel();
        closedChannel.setTitle("test1");
        closedChannel.setCategory(Category.Menage);
        closedChannel.setRecord(record);
        closeChannelRepository.save(closedChannel);
        ClosedChannel closeChan = new ClosedChannel();
        closeChan.setTitle("test2");
        closeChan.setCategory(Category.Alimentation);
        closeChan.setRecord(record);
        closeChannelRepository.save(closeChan);

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        get("/api/" + userTest.getId() + "/records/" + record.getId() + "/closechannels/categorys/" + Category.Menage)
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        List<RecordController.FilResponse> infos = objectMapper.readValue(
                json,
                List.class
        );

        assertEquals(1, infos.size());
    }

    @Test
    void testcreateChannel() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        record = recordRepository.save(record);

        RecordAccount recordAccount = new RecordAccount();
        recordAccount.setAccount(userTest);
        recordAccount.setRecord(record);
        recordAccount.setTitle(Role.AIDANT.getTitre());
        recordAccount.setPermissions(List.of(Permission.OPEN_CHANNEL));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        RecordController.CreateFilRequest request = new RecordController.CreateFilRequest("test1", Category.Menage, "First message");

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        post("/api/" + userTest.getId() + "/records/" + record.getId() + "/channels/new")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        RecordController.FilResponse infos = objectMapper.readValue(
                json,
                RecordController.FilResponse.class
        );

        assertEquals("test1", infos.title());
    }

    @Test
    void testarchiveChannel() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        record = recordRepository.save(record);

        RecordAccount recordAccount = new RecordAccount();
        recordAccount.setAccount(userTest);
        recordAccount.setRecord(record);
        recordAccount.setTitle(Role.AIDANT.getTitre());
        recordAccount.setPermissions(List.of(Permission.CLOSE_CHANNEL));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        Date date = new Date();
        OpenChannel openChannel = new OpenChannel("cuisine", date, Category.Menage, record);
        channelRepository.save(openChannel);

        // 2. Exécution
        mockMvc.perform(post("/api/" + userTest.getId() + "/records/" + record.getId() + "/channels/" + openChannel.getId() + "/archive")
                        .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                        .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    void testdeleteDossier() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        record = recordRepository.save(record);

        RecordAccount recordAccount = new RecordAccount();
        recordAccount.setAccount(userTest);
        recordAccount.setRecord(record);
        recordAccount.setTitle(Role.AIDANT.getTitre());
        recordAccount.setPermissions(List.of(Permission.DELETE_RECORD));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        // 2. Exécution
        mockMvc.perform(delete("/api/" + userTest.getId() + "/records/delete/" + record.getId())
                        .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                        .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isNoContent())
                .andReturn();

        assertNotEquals(record.getId(), recordRepository.findById(record.getId()));
    }
}