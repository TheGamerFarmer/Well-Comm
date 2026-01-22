package fr.wellcomm.wellcomm.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.domain.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.Column;

@Entity
@Table(name = "record_accounts")
@Data
@NoArgsConstructor
public class RecordAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    @JsonIgnore
    private Account account;
    @ManyToOne
    @JsonIgnore
    private Record record;
    @Column(nullable = false)
    private String title;
    @ElementCollection(targetClass = Permission.class)
    @CollectionTable(name = "record_permissions", joinColumns = @JoinColumn(name = "record_account_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "permission_name")
    private List<Permission> permissions;
    @Column(name = "creation_date", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public RecordAccount(Account account, Record record, Role role) {
        this.account = account;
        this.record = record;
        this.title = role.getTitre();
        this.permissions = role.getPermission();
    }
}