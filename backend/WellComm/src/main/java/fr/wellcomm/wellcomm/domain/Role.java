package fr.wellcomm.wellcomm.domain;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
public enum Role {
    AIDANT("Aidant",
            Permission.ModifierAgenda,
            Permission.AssignerPermissions,
            Permission.Inviter),
    EMPLOYEE("Employée",
            Permission.AssignerPermissions,
            Permission.Inviter),
    MEDECIN("Médecin",
            Permission.IsMedecin);

    private final String titre;
    private final List<Permission> permission;

    Role(String titre, Permission... permissions) {
        this.titre = titre;
        this.permission = new ArrayList<>(Arrays.asList(permissions));
    }
}
