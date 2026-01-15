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
            Permission.OPEN_CHANNEL,
            Permission.CLOSE_CHANNEL,
            Permission.SEND_MESSAGE,
            Permission.MODIFY_MESSAGE,
            Permission.DELETE_MESSAGE),
    EMPLOYEE("Employée",
            Permission.OPEN_CHANNEL,
            Permission.CLOSE_CHANNEL,
            Permission.SEND_MESSAGE,
            Permission.MODIFY_MESSAGE,
            Permission.DELETE_MESSAGE),
    MEDECIN("Médecin",
            Permission.IS_MEDECIN,
            Permission.OPEN_CHANNEL,
            Permission.CLOSE_CHANNEL,
            Permission.SEND_MESSAGE,
            Permission.MODIFY_MESSAGE,
            Permission.DELETE_MESSAGE),
    AIDANT_CREATEUR("Aidant",
            Permission.IS_ADMIN,
            Permission.MODIFIER_AGENDA,
            Permission.ASSIGNER_PERMISSIONS,
            Permission.INVITER,
            Permission.OPEN_CHANNEL,
            Permission.CLOSE_CHANNEL,
            Permission.SEND_MESSAGE,
            Permission.MODIFY_MESSAGE,
            Permission.DELETE_MESSAGE);

    private final String titre;
    private final List<Permission> permission;

    Role(String titre, Permission... permissions) {
        this.titre = titre;
        this.permission = new ArrayList<>(Arrays.asList(permissions));
    }
}
