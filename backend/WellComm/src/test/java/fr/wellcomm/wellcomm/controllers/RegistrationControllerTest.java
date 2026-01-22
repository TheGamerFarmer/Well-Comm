package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.repositories.CalendarRepository;
import fr.wellcomm.wellcomm.repositories.EventRepository;
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
import java.util.Map;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class RegistrationControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private WebApplicationContext context;
    @Autowired
    private AccountRepository accountRepository;
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
    void testregister() throws Exception {
        // Création des données
        RegistrationController.RegisterRequest request =
                new RegistrationController.RegisterRequest();
        request.setUserName("user");
        request.setFirstName("first");
        request.setLastName("last");
        request.setPassword("password");

        // Exécution
        MvcResult result = mockMvc.perform(
                        post("/api/register")
                                .with(SecurityMockMvcRequestPostProcessors.csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isCreated())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        Map<String, Object> infos = objectMapper.readValue(json, Map.class);
        assertTrue(infos.containsKey("id"));
        assertEquals("user", infos.get("userName"));

        Account account = accountRepository.findByUserName("user").orElseThrow();
        assertEquals("user", account.getUserName());
    }

}