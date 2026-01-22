package fr.wellcomm.wellcomm.controllers;

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
import tools.jackson.databind.ObjectMapper;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class RecordAccountControllerTest {
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


    @BeforeEach
    void setup() {
        // Pour tester la sécurité @PreAuthorize, on doit appliquer springSecurity()
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    void testgetPermissions() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest.getId());
        record = recordRepository.save(record);

        RecordAccount recordAccount = new RecordAccount();
        recordAccount.setAccount(userTest);
        recordAccount.setRecord(record);
        recordAccount.setTitle(Role.AIDANT.getTitre());
        recordAccount.setPermissions(List.of(Permission.CLOSE_CHANNEL));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        get("/api/" + userTest.getId() + "/recordsaccount/" + record.getId() + "/permissions")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        List<Permission> infos = objectMapper.readValue(
                json,
                List.class
        );

        assertEquals(1, infos.size());
    }

    @Test
    void testgetAutrePermissions() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest.getId());
        record = recordRepository.save(record);

        RecordAccount recordAccount = new RecordAccount();
        recordAccount.setAccount(userTest);
        recordAccount.setRecord(record);
        recordAccount.setTitle(Role.AIDANT.getTitre());
        recordAccount.setPermissions(List.of(Permission.CLOSE_CHANNEL));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        Account assistant = new Account();
        assistant.setUserName("assistant");
        assistant = accountRepository.save(assistant);
        String assistantName = "assistant";
        RecordAccount ra = new RecordAccount();
        ra.setAccount(assistant);
        ra.setRecord(record);
        ra.setTitle(Role.EMPLOYEE.getTitre());
        ra.setPermissions(List.of(Permission.CLOSE_CHANNEL));
        recordAccountRepository.save(ra);

        assistant.getRecordAccounts().put(record.getId(), ra);
        accountRepository.save(assistant);

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        get("/api/" + userTest.getId() + "/recordsaccount/" + record.getId() + "/autrepermissions/" + assistantName)
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        List<Permission> infos = objectMapper.readValue(
                json,
                List.class
        );

        assertEquals(1, infos.size());
    }

    @Test
    void testgetAssistantsByrecordId() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest.getId());
        record = recordRepository.save(record);

        RecordAccount recordAccount = new RecordAccount();
        recordAccount.setAccount(userTest);
        recordAccount.setRecord(record);
        recordAccount.setTitle(Role.AIDANT.getTitre());
        recordAccount.setPermissions(List.of(Permission.CLOSE_CHANNEL));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        Account assistant = new Account();
        assistant.setUserName("assistant");
        assistant = accountRepository.save(assistant);
        String assistantName = "assistant";
        RecordAccount ra = new RecordAccount();
        ra.setAccount(assistant);
        ra.setRecord(record);
        ra.setTitle(Role.EMPLOYEE.getTitre());
        ra.setPermissions(List.of(Permission.CLOSE_CHANNEL));
        recordAccountRepository.save(ra);

        assistant.getRecordAccounts().put(record.getId(), ra);
        accountRepository.save(assistant);

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        get("/api/" + userTest.getId() + "/recordsaccount/" + record.getId() + "/assistants")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        List<RecordAccountController.RecordAccountResponse> infos = objectMapper.readValue(
                json,
                List.class
        );

        assertEquals(1, infos.size());
    }

    @Test
    void testgetByrecordId() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest.getId());
        record = recordRepository.save(record);

        RecordAccount recordAccount = new RecordAccount();
        recordAccount.setAccount(userTest);
        recordAccount.setRecord(record);
        recordAccount.setTitle(Role.AIDANT.getTitre());
        recordAccount.setPermissions(List.of(Permission.CLOSE_CHANNEL));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        Account assistant = new Account();
        assistant.setUserName("assistant");
        assistant = accountRepository.save(assistant);
        String assistantName = "assistant";
        RecordAccount ra = new RecordAccount();
        ra.setAccount(assistant);
        ra.setRecord(record);
        ra.setTitle(Role.MEDECIN.getTitre());
        ra.setPermissions(List.of(Permission.CLOSE_CHANNEL));
        recordAccountRepository.save(ra);

        assistant.getRecordAccounts().put(record.getId(), ra);
        accountRepository.save(assistant);

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        get("/api/" + userTest.getId() + "/recordsaccount/" + record.getId() + "/medecin")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        List<RecordAccountController.RecordAccountResponse> infos = objectMapper.readValue(
                json,
                List.class
        );

        assertEquals(1, infos.size());
    }

    @Test
    void testgetMedecinsByrecordId() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest.getId());
        record = recordRepository.save(record);

        RecordAccount recordAccount = new RecordAccount();
        recordAccount.setAccount(userTest);
        recordAccount.setRecord(record);
        recordAccount.setTitle(Role.AIDANT.getTitre());
        recordAccount.setPermissions(List.of(Permission.CLOSE_CHANNEL));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        Account assistant = new Account();
        assistant.setUserName("assistant");
        assistant = accountRepository.save(assistant);
        String assistantName = "assistant";
        RecordAccount ra = new RecordAccount();
        ra.setAccount(assistant);
        ra.setRecord(record);
        ra.setTitle(Role.MEDECIN.getTitre());
        ra.setPermissions(List.of(Permission.CLOSE_CHANNEL));
        recordAccountRepository.save(ra);

        assistant.getRecordAccounts().put(record.getId(), ra);
        accountRepository.save(assistant);

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        get("/api/" + userTest.getId() + "/recordsaccount/" + record.getId() + "/medecins")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        List<RecordAccountController.RecordAccountResponse> infos = objectMapper.readValue(
                json,
                List.class
        );

        assertEquals(1, infos.size());
    }

    @Test
    void testchangePermissions() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest.getId());
        record = recordRepository.save(record);

        RecordAccount recordAccount = new RecordAccount();
        recordAccount.setAccount(userTest);
        recordAccount.setRecord(record);
        recordAccount.setTitle(Role.AIDANT.getTitre());
        recordAccount.setPermissions(List.of(Permission.ASSIGN_PERMISSIONS));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        Account assistant = new Account();
        assistant.setUserName("assistant");
        assistant = accountRepository.save(assistant);
        String assistantName = "assistant";
        RecordAccount ra = new RecordAccount();
        ra.setAccount(assistant);
        ra.setRecord(record);
        ra.setTitle(Role.EMPLOYEE.getTitre());
        ra.setPermissions(List.of(Permission.CLOSE_CHANNEL));
        recordAccountRepository.save(ra);

        assistant.getRecordAccounts().put(record.getId(), ra);
        accountRepository.save(assistant);

        RecordAccountController.ChangePermissionsRequest request = new RecordAccountController.ChangePermissionsRequest();
        request.setUserName("assistant");
        request.setPermissions(List.of(Permission.CLOSE_CHANNEL, Permission.OPEN_CHANNEL));


        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        put("/api/" + userTest.getId() + "/recordsaccount/" + record.getId() + "/changepermissions")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        List<Permission> infos = objectMapper.readValue(
                json,
                List.class
        );

        assertEquals(2, infos.size());
    }
}