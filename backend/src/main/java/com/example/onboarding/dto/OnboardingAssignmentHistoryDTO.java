package com.example.onboarding.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingAssignmentHistoryDTO {
    private Long id;
    private Long onboardingId;
    private Long previousHrId;
    private String previousHrUsername;
    private Long newHrId;
    private String newHrUsername;
    private String action;
    private Instant timestamp;
    private String performedBy;
}

