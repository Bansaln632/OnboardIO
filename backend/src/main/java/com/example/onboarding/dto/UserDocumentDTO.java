package com.example.onboarding.dto;

import com.example.onboarding.entity.UserDocument;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDocumentDTO {
    private Long id;
    private Long userId;
    private Long documentId;
    private String documentName;
    private String documentType;    // MANDATORY or OPTIONAL
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private LocalDateTime uploadedAt;
    private String status;          // PENDING, UPLOADED, REJECTED
    private String approvalStatus;  // PENDING, APPROVED, REJECTED
    private String rejectionReason;
    private LocalDateTime approvalUpdatedAt;

    // Additional fields for admin view
    private String username;
    private String userEmail;

    public static UserDocumentDTO fromUserDocument(UserDocument ud) {
        if (ud == null) return null;
        return new UserDocumentDTO(
                ud.getId(),
                ud.getUser().getId(),
                ud.getDocument().getId(),
                ud.getDocument().getName(),
                ud.getDocument().getDocumentType().toString(),
                ud.getFileUrl(),
                ud.getFileName(),
                ud.getFileSize(),
                ud.getFileType(),
                ud.getUploadedAt(),
                ud.getStatus().toString(),
                ud.getApprovalStatus().toString(),
                ud.getRejectionReason(),
                ud.getApprovalUpdatedAt(),
                null,  // username - set separately if needed
                null   // userEmail - set separately if needed
        );
    }
}

