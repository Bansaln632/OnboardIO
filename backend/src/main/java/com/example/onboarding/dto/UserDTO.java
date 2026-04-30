package com.example.onboarding.dto;

import com.example.onboarding.entity.Profile;
import com.example.onboarding.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private String contactNo;
    private String employeeId;
    private Profile profile;
}

