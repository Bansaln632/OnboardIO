package com.example.onboarding.entity;

import com.example.onboarding.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Onboarding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JsonIgnoreProperties({"assignedHr", "password"})
    private User employee;

    @Enumerated(EnumType.STRING)
    private OnboardingStatus status = OnboardingStatus.NOT_STARTED; // default NOT_STARTED

    private int progress; // 0-100

    @ManyToOne
    @JoinColumn(name = "assigned_hr_id")
    @JsonIgnoreProperties({"assignedHr", "password"})
    private User assignedHr;

    @Enumerated(EnumType.STRING)
    private DocumentUploadStatus documentUploadStatus = DocumentUploadStatus.PENDING;

    public enum DocumentUploadStatus {
        PENDING,                          // No documents uploaded yet
        ALL_MANDATORY_UPLOADED,           // All mandatory documents uploaded
        ALL_DOCUMENTS_UPLOADED            // All mandatory and optional documents uploaded
    }
}
