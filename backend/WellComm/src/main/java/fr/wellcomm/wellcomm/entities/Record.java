package fr.wellcomm.wellcomm.entities;

import fr.wellcomm.wellcomm.domain.Report;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "record")
@Getter
@Setter
@NoArgsConstructor
public class Record {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private Long admin;
    //Relation vers Fil (Un dossier a plusieurs fils)
    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    @MapKey(name = "id")
    private Map<Long, OpenChannel> openChannels = new HashMap<>();
    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    @MapKey(name = "id")
    private Map<Long, CloseChannel> closeChannels = new HashMap<>();
    //Relation vers CompteParDossier (Un dossier a plusieurs comptesParDossier)
    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecordAccount> recordAccounts = new ArrayList<>();
    @Transient
    private Report report = new Report();
    @OneToOne(cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JoinColumn(name = "calendar_id")
    private Calendar calendar;

    public Record(String name, Long admin) {
        this.name = name;
        this.admin = admin;
    }
}
