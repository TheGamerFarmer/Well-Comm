package fr.wellcomm.wellcomm.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.domain.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;
import java.time.LocalDateTime;
import jakarta.persistence.Column;

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
    @JsonIgnore
    private Account account;
    // Relation vers le dossier (Plusieurs utilisateurs pour un dossier)
    @ManyToOne
    @JsonIgnore
    private Record record;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role title;
    @ElementCollection(targetClass = Permission.class)
    @CollectionTable(name = "record_permissions", joinColumns = @JoinColumn(name = "record_account_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "permission_name")
    private List<Permission> permissions;
    @Column(name = "date_creation",nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @PrePersist
        public void onCreate() {
            this.createdAt = LocalDateTime.now();
        }

    public RecordAccount(Account account, Record record, Role title, List<Permission> permissions) {
        this.account = account;
        this.record = record;
        this.title = title;
        this.permissions = permissions;
    }
}