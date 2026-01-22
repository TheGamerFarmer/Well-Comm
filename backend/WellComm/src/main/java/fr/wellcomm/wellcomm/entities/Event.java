package fr.wellcomm.wellcomm.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "calendar_id")
    @JsonIgnore
    private Calendar calendar;
    private String title;
    private LocalDateTime timeStart;
    private LocalDateTime timeEnd;
    private String description;
    private String location;
    private String color;

    public Event(Calendar calendar, String title, LocalDateTime timeStart, LocalDateTime timeEnd, String description, String location, String color) {
        this.calendar = calendar;
        this.title = title;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
        this.description = description;
        this.location = location;
        this.color = color;
    }
}