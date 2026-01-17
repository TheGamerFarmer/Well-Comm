package fr.wellcomm.wellcomm.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.awt.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private LocalDateTime timeStart;
    private LocalDateTime timeEnd;
    private String description;
    private String location;
    private Color color;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "calendar_id")
    @JsonIgnore
    private Calendar calendar;

    public Event(String title, LocalDateTime start, LocalDateTime end, String description, String location, Color color, Calendar calendar) {
        this.title = title;
        this.timeStart = start;
        this.timeEnd = end;
        this.description = description;
        this.location = location;
        this.color = color;
        this.calendar = calendar;
    }
}