package com.example.onboarding.entity;

import com.example.onboarding.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class UserDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(optional = false)
    @JsonIgnoreProperties({"password", "assignedHr"})
    private User user;

    @ManyToOne(optional = false)
    private Document document;

    // File storage path/URL (can be cloud URL or local path)
    private String fileUrl;

    // File metadata
    private String fileName;
    private Long fileSize; // in bytes
    private String fileType; // MIME type

    // Upload tracking
    private LocalDateTime uploadedAt;

    @Enumerated(EnumType.STRING)
    private UploadStatus status = UploadStatus.PENDING;

    // Approval tracking
    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    private String rejectionReason;
    private LocalDateTime approvalUpdatedAt;

    public enum UploadStatus {
        PENDING,      // Not yet uploaded
        UPLOADED,     // Successfully uploaded
        REJECTED      // Failed validation or rejected by admin
    }

    public enum ApprovalStatus {
        PENDING,      // Waiting for admin approval
        APPROVED,     // Admin approved
        REJECTED      // Admin rejected
    }
}

