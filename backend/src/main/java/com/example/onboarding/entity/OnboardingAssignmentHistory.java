package com.example.onboarding.entity;

import com.example.onboarding.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
public class OnboardingAssignmentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Onboarding onboarding;

    @ManyToOne
    private User previousHr;

    @ManyToOne
    private User newHr;

    private String action; // ASSIGNED / UNASSIGNED / REASSIGNED

    private Instant timestamp;

    private String performedBy; // username or system
}

