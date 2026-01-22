package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.services.ChannelService;
import fr.wellcomm.wellcomm.services.RecordService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import tools.jackson.databind.ObjectMapper;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class LoginControllerTest {
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
    @Autowired
    private PasswordEncoder passwordEncoder;


    @BeforeEach
    void setup() {
        // Pour tester la sécurité @PreAuthorize, on doit appliquer springSecurity()
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    void testlogin() throws Exception {
        // Création des données
        Account testuser = new Account();
        testuser.setUserName("testuser");
        testuser.setPassword(passwordEncoder.encode("password"));
        testuser = accountRepository.save(testuser);

        LoginController.LoginRequest request = new LoginController.LoginRequest(testuser.getUserName(), "password");

        // Exécution
        mockMvc.perform(
                        post("/api/login")
                                .with(SecurityMockMvcRequestPostProcessors.csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    @WithMockUser(username = "userTest")
    void isLoginTrue() throws Exception {
        mockMvc.perform(get("/api/isLogin"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void isLoginFalse() throws Exception {
        mockMvc.perform(get("/api/isLogin"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

}