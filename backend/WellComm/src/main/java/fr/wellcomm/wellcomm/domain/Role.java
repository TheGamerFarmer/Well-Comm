package fr.wellcomm.wellcomm.domain;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
public enum Role {
    AIDANT("Aidant",
            Permission.MODIFIER_AGENDA,
            Permission.ASSIGNER_PERMISSIONS,
            Permission.INVITER,
            Permission.IS_ADMIN),
    EMPLOYEE("Employée",
            Permission.ASSIGNER_PERMISSIONS,
            Permission.INVITER),
    MEDECIN("Médecin",
            Permission.IS_MEDECIN);

    private final String titre;
    private final List<Permission> permission;

    Role(String titre, Permission... permissions) {
        this.titre = titre;
        this.permission = new ArrayList<>(Arrays.asList(permissions));
    }
}
