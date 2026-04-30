package com.example.onboarding.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * File storage service that supports multiple strategies:
 * 1. LOCAL - Store files locally on the server (default, good for development)
 * 2. AWS_S3 - Store on AWS S3 (recommended for production, free tier available)
 * 3. FIREBASE - Store on Firebase Storage (alternative cloud solution)
 *
 * Configuration: Set 'storage.type' in application.properties
 */
@Service
public class FileStorageService {

    @Value("${storage.type:LOCAL}")
    private String storageType;

    @Value("${storage.local.path:uploads}")
    private String localStoragePath;

    @Value("${storage.local.max-size:20971520L}") // 20 MB default
    private Long maxFileSize;

    @Value("${storage.local.min-size:5120L}") // 5 KB default
    private Long minFileSize;

    @Value("${server.base-url:http://localhost:8080}")
    private String serverBaseUrl;

    private static final String[] ALLOWED_TYPES = {
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };

    /**
     * Upload file and return URL/path
     * @param file MultipartFile to upload
     * @param userId User ID for organizing uploads
     * @return File URL or path
     * @throws IOException if upload fails
     * @throws IllegalArgumentException if file validation fails
     */
    public String uploadFile(MultipartFile file, Long userId) throws IOException {
        // Validate file
        validateFile(file);

        return switch (storageType.toUpperCase()) {
            case "AWS_S3" -> uploadToS3(file, userId);
            case "FIREBASE" -> uploadToFirebase(file, userId);
            default -> uploadToLocal(file, userId);
        };
    }

    /**
     * Upload file to local server storage
     */
    private String uploadToLocal(MultipartFile file, Long userId) throws IOException {
        // Create directory structure
        String userDir = localStoragePath + File.separator + "user_" + userId;
        Path userPath = Paths.get(userDir);
        Files.createDirectories(userPath);

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String uniqueFilename = UUID.randomUUID() + fileExtension;

        // Save file
        Path filePath = userPath.resolve(uniqueFilename);
        Files.write(filePath, file.getBytes());

        // Return full URL that includes server base URL
        return serverBaseUrl + "/uploads/user_" + userId + "/" + uniqueFilename;
    }

    /**
     * Upload file to AWS S3
     * Note: Requires AWS SDK and credentials configuration
     * Implementation would involve:
     * 1. Add AWS SDK dependency to pom.xml
     * 2. Configure AWS credentials (IAM user with S3 access)
     * 3. Use AmazonS3 client to upload
     */
    private String uploadToS3(MultipartFile file, Long userId) throws IOException {
        throw new UnsupportedOperationException(
                "AWS S3 storage not yet configured. " +
                "See documentation for setup instructions."
        );
        // TODO: Implement S3 upload when AWS SDK is added
    }

    /**
     * Upload file to Firebase Storage
     * Note: Requires Firebase Admin SDK configuration
     * Implementation would involve:
     * 1. Add Firebase Admin SDK dependency
     * 2. Initialize Firebase with service account
     * 3. Use FirebaseStorage to upload
     */
    private String uploadToFirebase(MultipartFile file, Long userId) throws IOException {
        throw new UnsupportedOperationException(
                "Firebase storage not yet configured. " +
                "See documentation for setup instructions."
        );
        // TODO: Implement Firebase upload when SDK is added
    }

    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        // Check if file is empty
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        // Check file size
        if (file.getSize() < minFileSize) {
            throw new IllegalArgumentException("File size must be at least 5 KB");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size must not exceed 20 MB");
        }

        // Check file type
        String contentType = file.getContentType();
        boolean isAllowed = false;
        for (String type : ALLOWED_TYPES) {
            if (type.equals(contentType)) {
                isAllowed = true;
                break;
            }
        }

        if (!isAllowed) {
            throw new IllegalArgumentException(
                    "File type not allowed. Allowed types: PDF, Word, Excel, JPEG, PNG"
            );
        }

        // Check filename
        String filename = file.getOriginalFilename();
        if (filename == null || filename.contains("..")) {
            throw new IllegalArgumentException("Invalid filename");
        }
    }

    /**
     * Delete uploaded file
     */
    public void deleteFile(String fileUrl) throws IOException {
        if (storageType.equalsIgnoreCase("LOCAL")) {
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

            Files.deleteIfExists(Paths.get(filePath));
        } else {
            // For cloud storage, implement deletion logic
            throw new UnsupportedOperationException("File deletion not yet implemented for " + storageType);
        }
    }
}

