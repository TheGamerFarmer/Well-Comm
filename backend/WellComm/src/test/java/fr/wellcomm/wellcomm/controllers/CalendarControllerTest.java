package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.domain.Role;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
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

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class CalendarControllerTest {
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
    private CalendarRepository calendarRepository;
    @Autowired
    private EventRepository eventRepository;
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
    void testgetCalendarContent() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        LocalDateTime timestart1 = LocalDateTime.now().minusHours(1);
        LocalDateTime timeend1 = LocalDateTime.now().plusHours(1);

        Record record = new Record("Dossier Secret", userTest);
        Calendar calendar = new Calendar();
        calendar.setRecord(record);

        Event event = new Event();
        event.setTimeStart(timestart1);
        event.setTimeEnd(timeend1);
        event.setCalendar(calendar);
        event = eventRepository.save(event);

        calendar.getEvents().put(1L, event);
        calendar = calendarRepository.save(calendar);
        record.setCalendar(calendar);
        record = recordRepository.save(record);
        RecordAccount ra = new RecordAccount(userTest, record, Role.AIDANT);
        recordAccountRepository.save(ra);

        LocalDateTime timestart = LocalDateTime.now().minusHours(2);
        LocalDateTime timeend = LocalDateTime.now().plusHours(2);



        // 2. Exécution
        MvcResult result = mockMvc.perform(
                        get("/api/" + userTest.getId() + "/records/" + record.getId() + "/calendar/startDate/" + timestart + "/endDate/" + timeend)
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();

        List<CalendarController.EventDTO> infos = objectMapper.readValue(
                json,
                List.class
        );

        assertEquals(1, infos.size());
    }

    @Test
    void testcreateEvent() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        Record record = new Record("Dossier Secret", userTest);
        Calendar calendar = new Calendar();
        calendar.setRecord(record);
        calendar = calendarRepository.save(calendar);
        record.setCalendar(calendar);
        record = recordRepository.save(record);
        RecordAccount ra = new RecordAccount(userTest, record, Role.AIDANT);
        recordAccountRepository.save(ra);

        CalendarController.EventDTO eventDTO = new CalendarController.EventDTO(1L, "test", "2025-01-22T12:30:00", "2025-01-22T13:30:00", "test", "ici", "red");

        // 2. Exécution
        mockMvc.perform(
                        post("/api/" + userTest.getId() + "/records/" + record.getId() + "/calendar/event")
                                .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(eventDTO))
                )
                .andExpect(status().isOk())
                .andReturn();



        List<Event> events = eventRepository.findAll();
        assertEquals(1, events.size());
    }

    @Test
    void testupdateEvent() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        LocalDateTime timestart1 = LocalDateTime.now().minusHours(1);
        LocalDateTime timeend1 = LocalDateTime.now().plusHours(1);

        Record record = new Record("Dossier Secret", userTest);
        Calendar calendar = new Calendar();
        calendar.setRecord(record);

        Event event = new Event();
        event.setTitle("test1");
        event.setTimeStart(timestart1);
        event.setTimeEnd(timeend1);
        event.setCalendar(calendar);
        event = eventRepository.save(event);

        calendar.getEvents().put(1L, event);
        calendar = calendarRepository.save(calendar);
        record.setCalendar(calendar);
        record = recordRepository.save(record);
        RecordAccount ra = new RecordAccount(userTest, record, Role.AIDANT);
        recordAccountRepository.save(ra);

        CalendarController.EventDTO eventDTO = new CalendarController.EventDTO(event.getId(), "test", "2025-01-22T12:30:00", "2025-01-22T13:30:00", "test", "ici", "red");

        // 2. Exécution
        mockMvc.perform(put("/api/" + userTest.getId() + "/records/" + record.getId() + "/calendar/event/" + event.getId())
                        .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                        .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(eventDTO))
                )
                .andExpect(status().isOk())
                .andReturn();



        Event events = eventRepository.findById(event.getId()).get();
        assertEquals("test", events.getTitle());
    }

    @Test
    void testdeleteEvent() throws Exception {
        // 1. Création des données réelles en base
        Account userTest = new Account();
        userTest.setUserName("userTest");
        userTest = accountRepository.save(userTest);

        LocalDateTime timestart1 = LocalDateTime.now().minusHours(1);
        LocalDateTime timeend1 = LocalDateTime.now().plusHours(1);

        Record record = new Record("Dossier Secret", userTest);
        Calendar calendar = new Calendar();
        calendar.setRecord(record);

        Event event = new Event();
        event.setTitle("test1");
        event.setTimeStart(timestart1);
        event.setTimeEnd(timeend1);
        event.setCalendar(calendar);
        event = eventRepository.save(event);

        calendar.getEvents().put(1L, event);
        calendar = calendarRepository.save(calendar);
        record.setCalendar(calendar);
        record = recordRepository.save(record);
        RecordAccount ra = new RecordAccount(userTest, record, Role.AIDANT);
        recordAccountRepository.save(ra);

        // 2. Exécution
        mockMvc.perform(delete("/api/" + userTest.getId() + "/records/" + record.getId() + "/calendar/event/" + event.getId())
                        .with(SecurityMockMvcRequestPostProcessors.user(userTest.getId().toString()))
                        .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();
    }
}