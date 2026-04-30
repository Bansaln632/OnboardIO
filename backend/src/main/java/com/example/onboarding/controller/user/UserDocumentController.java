package com.example.onboarding.controller.user;

import com.example.onboarding.dto.UserDocumentDTO;
import com.example.onboarding.service.impl.FileStorageService;
import com.example.onboarding.entity.User;
import com.example.onboarding.repository.UserRepository;
import com.example.onboarding.repository.UserDocumentRepository;
import com.example.onboarding.repository.DocumentRepository;
import com.example.onboarding.entity.UserDocument;
import com.example.onboarding.entity.Document;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/documents")
@RequiredArgsConstructor
public class UserDocumentController {

    private final UserDocumentRepository userDocumentRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    /**
     * Get all documents for current user (with their upload status)
     */
    @GetMapping
    public List<UserDocumentDTO> getUserDocuments(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userDocumentRepository.findByUser(user).stream()
                .map(UserDocumentDTO::fromUserDocument)
                .collect(Collectors.toList());
    }

    /**
     * Upload a document for current user
     * @param documentId ID of the document type to upload
     * @param file MultipartFile to upload (5KB - 20MB)
     */
    @PostMapping("/upload/{documentId}")
    public UserDocumentDTO uploadDocument(
            @PathVariable String documentId,
            @RequestParam("file") MultipartFile file,
            Authentication auth
    ) throws IOException {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Document document = documentRepository.findById(Long.parseLong(documentId))
                .orElseThrow(() -> new RuntimeException("Document type not found"));

        // Check if already uploaded - if so, delete old file before uploading new one
        var existing = userDocumentRepository.findByUserAndDocument(user, document);
        if (existing.isPresent() && existing.get().getStatus() == UserDocument.UploadStatus.UPLOADED) {
            // Delete old file before uploading replacement
            try {
                fileStorageService.deleteFile(existing.get().getFileUrl());
            } catch (IOException e) {
                // Log but don't fail - old file might not exist
                System.err.println("Failed to delete old file: " + e.getMessage());
            }
        }

        // Upload new file
        String fileUrl = fileStorageService.uploadFile(file, user.getId());

        // Save or update document metadata
        UserDocument userDoc = existing.orElse(new UserDocument());
        userDoc.setUser(user);
        userDoc.setDocument(document);
        userDoc.setFileUrl(fileUrl);
        userDoc.setFileName(file.getOriginalFilename());
        userDoc.setFileSize(file.getSize());
        userDoc.setFileType(file.getContentType());
        userDoc.setUploadedAt(LocalDateTime.now());
        userDoc.setStatus(UserDocument.UploadStatus.UPLOADED);

        UserDocument saved = userDocumentRepository.save(userDoc);
        return UserDocumentDTO.fromUserDocument(saved);
    }

    /**
     * Delete uploaded document
     */
    @DeleteMapping("/{userDocumentId}")
    public void deleteDocument(
            @PathVariable String userDocumentId,
            Authentication auth
    ) throws IOException {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDocument userDoc = userDocumentRepository.findById(Long.parseLong(userDocumentId))
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Ensure user owns this document
        if (!userDoc.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Delete file from storage
        if (userDoc.getFileUrl() != null) {
            fileStorageService.deleteFile(userDoc.getFileUrl());
        }

        userDocumentRepository.delete(userDoc);
    }

    /**
     * Re-upload a document (replace existing)
     */
    @PostMapping("/reupload/{userDocumentId}")
    public UserDocumentDTO reuploadDocument(
            @PathVariable String userDocumentId,
            @RequestParam("file") MultipartFile file,
            Authentication auth
    ) throws IOException {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDocument userDoc = userDocumentRepository.findById(Long.parseLong(userDocumentId))
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Ensure user owns this document
        if (!userDoc.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Delete old file
        if (userDoc.getFileUrl() != null) {
            fileStorageService.deleteFile(userDoc.getFileUrl());
        }

        // Upload new file
        String newFileUrl = fileStorageService.uploadFile(file, user.getId());

        // Update document - reset approval status to PENDING for re-review
        userDoc.setFileUrl(newFileUrl);
        userDoc.setFileName(file.getOriginalFilename());
        userDoc.setFileSize(file.getSize());
        userDoc.setFileType(file.getContentType());
        userDoc.setUploadedAt(LocalDateTime.now());
        userDoc.setStatus(UserDocument.UploadStatus.UPLOADED);

        // Reset approval status to PENDING and clear rejection reason
        userDoc.setApprovalStatus(UserDocument.ApprovalStatus.PENDING);
        userDoc.setRejectionReason(null);
        userDoc.setApprovalUpdatedAt(LocalDateTime.now());

        UserDocument saved = userDocumentRepository.save(userDoc);
        return UserDocumentDTO.fromUserDocument(saved);
    }

    /**
     * Download document with proper headers to force download
     */
    @GetMapping("/download/{userDocumentId}")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable String userDocumentId,
            Authentication auth
    ) throws IOException {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDocument userDoc = userDocumentRepository.findById(Long.parseLong(userDocumentId))
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Ensure user owns this document
        if (!userDoc.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

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

