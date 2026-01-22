package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.domain.Role;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.repositories.RecordRepository;
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
public class AccountControllerTest {
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
    void testgetInfos() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest.setFirstName("firstName");
        userTest.setLastName("lastName");
        userTest = accountRepository.save(userTest);

        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        get("/api/" + userTest.getId() + "/infos")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        AccountController.UserInfos infos = objectMapper.readValue(
                json,
                AccountController.UserInfos.class
        );

        assertEquals("userTest", infos.userName());
        assertEquals("firstName", infos.firstName());
        assertEquals("lastName", infos.lastName());
    }

    @Test
    void testupdateProfil() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest.setFirstName("firstName");
        userTest.setLastName("lastName");
        userTest.setPassword("password");
        userTest = accountRepository.save(userTest);

        AccountController.UserInfos request = new AccountController.UserInfos("newUser", "newFirstName", "newLastName");

        // 2. Exécution
        mockMvc.perform(
                        post("/api/" + userTest.getId() + "/changeUserInfos")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andReturn();

        Account infos = accountRepository.findByUserName(request.userName()).orElse(null);
        assertEquals("newUser", infos.getUserName());
        assertEquals("newFirstName", infos.getFirstName());
        assertEquals("newLastName", infos.getLastName());
    }

    @Test
    void testudeleteUser() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        // 2. Exécution
        mockMvc.perform(
                        delete("/api/" + userTest.getId() + "/deleteUser")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    void testaddRecordAccount() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        record = recordRepository.save(record);

        AccountController.addRecordAccountRequest request = new AccountController.addRecordAccountRequest(record.getId(), Role.AIDANT.getTitre());

        // 2. Exécution
        mockMvc.perform(
                        post("/api/" + userTest.getId() + "/addAccess")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andReturn();

        RecordAccount ra = recordAccountRepository.findByAccountIdAndRecordId(userTest.getId(), record.getId()).orElse(null);
        assertEquals("userTest", ra.getAccount().getUserName());

    }

    @Test
    void testaddRecordAccountCurrentRecord() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        record = recordRepository.save(record);

        Account testUser = new Account();
        testUser.setUserName("testUser");
        testUser = accountRepository.save(testUser);

        AccountController.addRecordAccountRequest request = new AccountController.addRecordAccountRequest(record.getId(), Role.AIDANT.getTitre());

        // 2. Exécution
        mockMvc.perform(
                        post("/api/" + userTest.getId() + "/addAccess/current_record/" + testUser.getUserName())
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andReturn();

        RecordAccount ra = recordAccountRepository.findByAccountIdAndRecordId(testUser.getId(), record.getId()).get();
        assertEquals("testUser", ra.getAccount().getUserName());
    }

    @Test
    void testdeleteRecordAccount() throws Exception {
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
        recordAccount.setPermissions(List.of(Permission.ASSIGN_PERMISSIONS));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        AccountController.deleteRecordAccountRequest request = new AccountController.deleteRecordAccountRequest(record.getId());

        // 2. Exécution
        mockMvc.perform(
                        delete("/api/" + userTest.getId() + "/deleteAccess/")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    void testdeleteRecordAccount2() throws Exception {
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
        recordAccount.setPermissions(List.of(Permission.ASSIGN_PERMISSIONS));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        Account testUser = new Account();
        testUser.setUserName("testUser");
        testUser = accountRepository.save(testUser);

        RecordAccount ra = new RecordAccount();
        ra.setAccount(testUser);
        ra.setRecord(record);
        ra.setTitle(Role.EMPLOYEE.getTitre());
        ra.setPermissions(List.of(Permission.OPEN_CHANNEL));
        recordAccountRepository.save(ra);

        testUser.getRecordAccounts().put(record.getId(), ra);
        accountRepository.save(testUser);

        AccountController.deleteRecordAccountRequest request = new AccountController.deleteRecordAccountRequest(record.getId());

        // 2. Exécution
        mockMvc.perform(
                        delete("/api/" + userTest.getId() + "/deleteAccess/current_record/" + testUser.getUserName() + "/" + record.getId())
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    void testupdateRecordAccount() throws Exception {
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
        recordAccount.setPermissions(List.of(Permission.ASSIGN_PERMISSIONS));
        recordAccountRepository.save(recordAccount);

        userTest.getRecordAccounts().put(record.getId(), recordAccount);
        accountRepository.save(userTest);

        Account testUser = new Account();
        testUser.setUserName("testUser");
        testUser = accountRepository.save(testUser);

        RecordAccount ra = new RecordAccount();
        ra.setAccount(testUser);
        ra.setRecord(record);
        ra.setTitle(Role.AIDANT.getTitre());
        ra.setPermissions(List.of(Permission.OPEN_CHANNEL));
        recordAccountRepository.save(ra);

        testUser.getRecordAccounts().put(record.getId(), ra);
        accountRepository.save(testUser);

        AccountController.deleteRecordAccountRequest request = new AccountController.deleteRecordAccountRequest(record.getId());

        // 2. Exécution
        mockMvc.perform(
                        put("/api/" + userTest.getId() + "/updateRoleAccess/current_record/" + testUser.getId() + "/" + record.getId() + "/" + Role.EMPLOYEE.getTitre())
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andReturn();

        RecordAccount ra2 = recordAccountRepository.findByAccountIdAndRecordId(testUser.getId(), record.getId()).get();
        assertEquals(Role.EMPLOYEE.getTitre(), ra2.getTitle());
    }
}