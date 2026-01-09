package fr.wellcomm.wellcomm.entities;

import fr.wellcomm.wellcomm.domain.Permission;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "record_account")
@Getter
@Setter
@NoArgsConstructor
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
    @ElementCollection(targetClass = Permission.class)
    @CollectionTable(name = "record_permissions", joinColumns = @JoinColumn(name = "record_account_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "permission_name")
    private List<Permission> permissions;

    public RecordAccount(Account account, Record record, String title, List<Permission> permissions) {
        this.account = account;
        this.record = record;
        this.title = title;
        this.permissions = permissions;
    }
}