package fr.wellcomm.wellcomm.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "calendars")
@Data
@NoArgsConstructor
public class Calendar {
    @Id
    private long id;
    @OneToOne
    @MapsId
    @JoinColumn(name = "record_id")
    @JsonIgnore
    private Record record;
    @OneToMany(mappedBy = "calendar", cascade = CascadeType.ALL, orphanRemoval = true)
    private Map<Long, Event> events = new HashMap<>();

    public Calendar(@NotNull Record record) {
        this.record = record;
    }
}