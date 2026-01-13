package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
    private List<RecordAccount> recordAccounts = new ArrayList<>();

    public Account(String userName, String lastName, String firstName, String password) {
        this.userName = userName;
        this.lastName = lastName;
        this.firstName = firstName;
        this.password = password;
    }
}