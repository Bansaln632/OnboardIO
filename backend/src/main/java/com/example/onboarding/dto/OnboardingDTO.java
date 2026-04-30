package com.example.onboarding.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingDTO {
    private Long id;
    private Long employeeId;
    private String employeeUsername;
    private String status;
    private int progress;
    private Long assignedHrId; // nullable
    private String assignedHrUsername; // nullable
}

