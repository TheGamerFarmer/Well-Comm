package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "account")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    @Id
    private String userName;
    private String firstName;
    private String lastName;
    private String password;
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private Map<Long, RecordAccount> recordAccounts = new HashMap<>();
    private int failedAttempts;
    private LocalDateTime lockTime;
    private boolean isLocked;

    public Account(String userName, String firstName, String lastName, String password) {
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }

    public boolean existsByUserName(String userName) {
        return accountRepository.existsById(userName);
    }
}