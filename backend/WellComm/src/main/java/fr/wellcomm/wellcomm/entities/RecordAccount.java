package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "record_account")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecordAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    // Relation vers l'utilisateur (Plusieurs accès pour un utilisateur)
    @ManyToOne
    private Account account;
    // Relation vers le dossier (Plusieurs utilisateurs pour un dossier)
    @ManyToOne
    private Record record;
    private String title;

    public RecordAccount(Account account, Record record, String title) {
        this.account = account;
        this.record = record;
        this.title = title;
    }
}