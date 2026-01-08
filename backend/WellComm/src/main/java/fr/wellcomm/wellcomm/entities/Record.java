package fr.wellcomm.wellcomm.entities;

import fr.wellcomm.wellcomm.domain.Report;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "record")
@Getter
@Setter
@NoArgsConstructor
public class Record {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;
    private String name;
    //Relation vers Fil (Un dossier a plusieurs fils)
    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OpenChannel> openChannels = new ArrayList<>();
    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CloseChannel> closeChannels = new ArrayList<>();
    //Relation vers CompteParDossier (Un dossier a plusieurs comptesParDossier)
    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecordAccount> recordAccounts = new ArrayList<>();
    @Transient
    private Report report = new Report();

    public Record(String name) {
        this.name = name;
    }
}
