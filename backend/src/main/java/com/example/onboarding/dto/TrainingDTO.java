package com.example.onboarding.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingDTO {
    private Long id;
    private String name;
    private boolean started;
    private boolean completed;
    private Long employeeId;
    private String employeeUsername;
    private String content;
}
