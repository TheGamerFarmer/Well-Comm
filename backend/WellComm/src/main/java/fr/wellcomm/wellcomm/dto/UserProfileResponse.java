package fr.wellcomm.wellcomm.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserProfileResponse {
    private String userName;
    private String firstName;
    private String lastName;
}
