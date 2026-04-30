package com.example.onboarding.controller.admin;

import com.example.onboarding.dto.DocumentDTO;
import com.example.onboarding.dto.UserDocumentDTO;
import com.example.onboarding.entity.Document;
import com.example.onboarding.entity.Profile;
import com.example.onboarding.entity.User;
import com.example.onboarding.entity.UserDocument;
import com.example.onboarding.repository.DocumentRepository;
import com.example.onboarding.repository.UserDocumentRepository;
import com.example.onboarding.repository.UserRepository;
import com.example.onboarding.util.OnboardingProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/documents")
@RequiredArgsConstructor
public class AdminDocumentController {

    private final UserDocumentRepository userDocumentRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final OnboardingProgressService progressService;

    // ==================== Document Type Management ====================

    /**
     * Get all document types
     */
    @GetMapping
    public List<DocumentDTO> getAllDocumentTypes() {
        return documentRepository.findAll().stream()
                .map(DocumentDTO::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Create a new document type
     * Admin adds a document requirement that will automatically appear for all users
     * @param name Document name (e.g., "ID Proof", "Address Proof")
     * @param type MANDATORY or OPTIONAL
     */
    @PostMapping
    @Transactional
    public DocumentDTO createDocumentType(@RequestParam String name, @RequestParam String type) {
        Document document = new Document();
        document.setName(name);
        document.setDocumentType(Document.DocumentType.valueOf(type.toUpperCase()));

        Document saved = documentRepository.save(document);
        documentRepository.flush(); // Ensure ID is generated immediately

        // Auto-create UserDocument entries for all existing regular users
        List<User> regularUsers = userRepository.findAll().stream()
                .filter(u -> u.getProfile() == Profile.REGULAR)
                .collect(Collectors.toList());

        for (User user : regularUsers) {
            UserDocument userDoc = new UserDocument();
            userDoc.setUser(user);
            userDoc.setDocument(saved);
            userDoc.setStatus(UserDocument.UploadStatus.PENDING);
            userDoc.setApprovalStatus(UserDocument.ApprovalStatus.PENDING);
            userDocumentRepository.save(userDoc);
        }

        // Flush all UserDocument saves to ensure IDs are generated
        userDocumentRepository.flush();

        return DocumentDTO.fromDocument(saved);
    }

    /**
     * Delete a document type
     * WARNING: This will also delete all user uploads for this document type
     */
    @DeleteMapping("/{documentId}")
    public void deleteDocumentType(@PathVariable Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document type not found"));

        // Delete all UserDocument entries for this document type
        List<UserDocument> userDocuments = userDocumentRepository.findAll().stream()
                .filter(ud -> ud.getDocument().getId().equals(documentId))
                .collect(Collectors.toList());

        userDocumentRepository.deleteAll(userDocuments);

        // Delete the document type itself
        documentRepository.delete(document);
    }

    // ==================== User Document Management ====================

    /**
     * Get all uploaded documents across all users (for admin review)
     * Only returns documents that have been uploaded (not pending)
     */
    @GetMapping("/uploaded")
    public List<UserDocumentDTO> getAllUploadedDocuments() {
        return userDocumentRepository.findAll().stream()
                .filter(ud -> ud.getStatus() == UserDocument.UploadStatus.UPLOADED)
                .map(ud -> {
                    UserDocumentDTO dto = UserDocumentDTO.fromUserDocument(ud);
                    // Add username for easy identification
                    dto.setUserEmail(ud.getUser().getEmail());
                    dto.setUsername(ud.getUser().getUsername());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Get all documents uploaded by a specific user
     */
    @GetMapping("/user/{userId}")
    public List<UserDocumentDTO> getUserDocuments(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userDocumentRepository.findByUser(user).stream()
                .map(UserDocumentDTO::fromUserDocument)
                .collect(Collectors.toList());
    }

    /**
     * Approve a document uploaded by user
     */
    @PutMapping("/{userDocumentId}/approve")
    public UserDocumentDTO approveDocument(@PathVariable Long userDocumentId) {
        UserDocument userDoc = userDocumentRepository.findById(userDocumentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        userDoc.setApprovalStatus(UserDocument.ApprovalStatus.APPROVED);
        userDoc.setRejectionReason(null);
        userDoc.setApprovalUpdatedAt(LocalDateTime.now());

        UserDocument saved = userDocumentRepository.save(userDoc);

        // Recalculate onboarding progress for the employee
        progressService.recalculateForEmployee(saved.getUser().getId());

        return UserDocumentDTO.fromUserDocument(saved);
    }

    /**
     * Reject a document uploaded by user
     */
    @PutMapping("/{userDocumentId}/reject")
    public UserDocumentDTO rejectDocument(
            @PathVariable Long userDocumentId,
            @RequestParam String reason
    ) {
        UserDocument userDoc = userDocumentRepository.findById(userDocumentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        userDoc.setApprovalStatus(UserDocument.ApprovalStatus.REJECTED);
        userDoc.setRejectionReason(reason);
        userDoc.setApprovalUpdatedAt(LocalDateTime.now());

        UserDocument saved = userDocumentRepository.save(userDoc);

        // Recalculate onboarding progress for the employee
        progressService.recalculateForEmployee(saved.getUser().getId());

        return UserDocumentDTO.fromUserDocument(saved);
    }

    /**
     * Get document approval summary for a user
     * Returns overall status and list of rejected documents
     */
    @GetMapping("/user/{userId}/summary")
    public DocumentApprovalSummary getDocumentApprovalSummary(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserDocument> userDocs = userDocumentRepository.findByUser(user);

        // Check if any document is rejected
        List<UserDocument> rejectedDocs = userDocs.stream()
                .filter(d -> d.getApprovalStatus() == UserDocument.ApprovalStatus.REJECTED)
                .collect(Collectors.toList());

        // Check if all documents are approved
        List<UserDocument> approvedDocs = userDocs.stream()
                .filter(d -> d.getApprovalStatus() == UserDocument.ApprovalStatus.APPROVED)
                .collect(Collectors.toList());

        String overallStatus;
        if (!rejectedDocs.isEmpty()) {
            overallStatus = "REJECTED"; // Even 1 rejection means overall REJECTED
        } else if (approvedDocs.size() == userDocs.size() && !userDocs.isEmpty()) {
            overallStatus = "APPROVED";
        } else {
            overallStatus = "PENDING";
        }

        List<UserDocumentDTO> rejectedDocsList = rejectedDocs.stream()
                .map(UserDocumentDTO::fromUserDocument)
                .collect(Collectors.toList());

        return new DocumentApprovalSummary(overallStatus, rejectedDocsList);
    }

    /**
     * DTO for document approval summary
     */
    public static class DocumentApprovalSummary {
        public String overallStatus;      // APPROVED, REJECTED, PENDING
        public List<UserDocumentDTO> rejectedDocuments;

        public DocumentApprovalSummary(String overallStatus, List<UserDocumentDTO> rejectedDocuments) {
            this.overallStatus = overallStatus;
            this.rejectedDocuments = rejectedDocuments;
        }
    }

    /**
     * Download document for any user (admin only)
     */
    @GetMapping("/download/{userDocumentId}")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long userDocumentId
    ) throws IOException {
        UserDocument userDoc = userDocumentRepository.findById(userDocumentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Get file from storage
        String fileUrl = userDoc.getFileUrl();
        if (fileUrl == null || fileUrl.isEmpty()) {
            throw new RuntimeException("No file uploaded");
        }

        // Extract file path from URL - handle both absolute URLs and relative paths
        String filePath;
        if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
            // Extract the path portion after the domain
            // e.g., "http://localhost:8080/uploads/user_2/file.pdf" -> "uploads/user_2/file.pdf"
            int uploadsIndex = fileUrl.indexOf("/uploads/");
            if (uploadsIndex != -1) {
                filePath = fileUrl.substring(uploadsIndex + 1); // Remove leading /
            } else {
                throw new RuntimeException("Invalid file URL format: " + fileUrl);
            }
        } else {
            // Already a relative path, remove leading slash if present
            filePath = fileUrl.replaceFirst("^/", "");
        }

        java.nio.file.Path path = java.nio.file.Paths.get(filePath);
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("File not found or not readable: " + filePath);
        }

        // Set headers to force download
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(userDoc.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + userDoc.getFileName() + "\"")
                .body(resource);
    }
}

