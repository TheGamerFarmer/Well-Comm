package fr.wellcomm.wellcomm.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "records")
@Data
@NoArgsConstructor
public class Record {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    @ManyToOne
    @JsonIgnore
    private Account admin;
    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    @MapKey(name = "id")
    private Map<Long, OpenChannel> openChannels = new HashMap<>();
    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    @MapKey(name = "id")
    private Map<Long, ClosedChannel> closeChannels = new HashMap<>();
    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    @MapKey(name = "id")
    private Map<Long, RecordAccount> recordAccounts = new HashMap<>();
    @OneToOne(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    private Calendar calendar;

    public Record(String name, Account admin) {
        this.name = name;
        this.admin = admin;
    }
}
